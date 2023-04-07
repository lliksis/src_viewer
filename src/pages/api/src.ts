// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Game, PB, SRCGame_raw, SRCPB_raw } from "./src.types";

const srcBase = "https://www.speedrun.com/api/v1";
const srcPBs = (user: string) =>
  `${srcBase}/users/${user}/personal-bests?max=200`;

const categoryCache = new Map<string, string>();
const variableCache = new Map<string, string>();

export default async function handler(req: NextApiRequest) {
  const user = (req.query["user"] as string) || "lliksis";
  const pbs = await getPBs(user);
  return new Response(JSON.stringify(pbs), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}

export const getPBs = async (user: string) => {
  try {
    const response = await fetch(srcPBs(user));
    const pbs: SRCPB_raw[] = (await response.json()).data;

    const parsedPbs = await parsePBs(pbs);

    // map pbs by game
    const pbList: Game[] = [];
    for (let index = 0; index < parsedPbs.length; index++) {
      const pb = parsedPbs[index];
      const sectionId = pbList.findIndex((p) => p.id === pb.game_id);
      if (sectionId === -1) {
        const game = await parseGame(pb);
        pbList.push(game);
      } else {
        pbList[sectionId].pbs.push(pb);
      }
    }

    return pbList.sort((a, b) => (a.game_name > b.game_name ? 1 : -1));
  } catch (error) {
    return [];
  }
};

const parsePBs = async (pbs: SRCPB_raw[]) => {
  const parsedPbs: PB[] = [];
  for (let index = 0; index < pbs.length; index++) {
    const {
      place,
      run: {
        category,
        weblink,
        id,
        times: { primary },
        game,
        values,
      },
    } = pbs[index];

    const { videoUrl, embed_link, thumbnail } = await getRunEmbedVideo(id);

    const parsedPb: PB = {
      game_id: game,
      id,
      place,
      category: categoryCache.get(category) || (await parseCategory(category)),
      variables: await parseVariables(values),
      weblink,
      time: durationToString(primary),
      yt_link: videoUrl,
      yt_embed_link: embed_link,
      yt_thumbnail: thumbnail,
    };
    parsedPbs.push(parsedPb);
  }
  return parsedPbs;
};

const numbers = "\\d+(?:[\\.,]\\d+)?";
const weekPattern = `(${numbers}W)`;
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}D)?`;
const timePattern = `T(${numbers}H)?(${numbers}M)?(${numbers}S)?`;

const iso8601 = `P(?:${weekPattern}|${datePattern}(?:${timePattern})?)`;
const pattern = new RegExp(iso8601);

export const durationToString = (isoDuration: string) => {
  return isoDuration.match(pattern)?.slice(1).join(" ").toLowerCase() || "";
};

const parseGame = async (pb: PB): Promise<Game> => {
  const rawGame: SRCGame_raw = (
    await fetch(`${srcBase}/games/${pb.game_id}`).then((response) =>
      response.json()
    )
  ).data;
  return {
    id: pb.game_id,
    game_name: rawGame.names.international,
    game_background: rawGame.assets.background.uri,
    game_cover: rawGame.assets["cover-small"].uri,
    game_trophy_1: rawGame.assets["trophy-1st"].uri,
    game_trophy_2: rawGame.assets["trophy-2nd"].uri,
    game_trophy_3: rawGame.assets["trophy-3rd"].uri,
    pbs: [pb],
  };
};

const parseCategory = async (category: string) => {
  const rawCategory: string = (
    await fetch(`${srcBase}/categories/${category}`).then((response) =>
      response.json()
    )
  ).data.name;
  categoryCache.set(category, rawCategory);
  return rawCategory;
};

const parseVariables = async (values: any) => {
  const variables: string[] = [];
  for (const key in values) {
    const variableId = values[key];
    if (variableCache.has(variableId)) {
      variables.push(variableCache.get(variableId)!);
      continue;
    }
    const label: string = (
      await fetch(`${srcBase}/variables/${key}`).then((response) =>
        response.json()
      )
    ).data.values.values[variableId].label;
    variables.push(label);
    variableCache.set(variableId, label);
  }
  return variables.join(", ") || null;
};

const getRunEmbedVideo = async (run: string) => {
  var embed_link = null;
  var thumbnail = null;
  const response = await fetch(`${srcBase}/runs/${run}`);
  const videoUrl: string = (await response.json()).data.videos.links[0].uri;

  const match = videoUrl.match(
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  );

  if (match && match[2].length == 11) {
    embed_link = `https://www.youtube.com/embed/${match[2]}`;
    thumbnail = `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return { videoUrl, embed_link, thumbnail };
};
