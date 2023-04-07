export type SRCRun_raw = {
  id: string;
  game: string;
  category: string;
  times: SRCTimes_raw;
};

export type SRCTimes_raw = {
  primary: string;
  primary_t: number;
  realtime: string;
  realtime_t: number;
  realtime_noloads: string;
  realtime_noloads_t: number;
  ingame: string;
  ingame_t: number;
};

export type SRCPB_raw = {
  place: number;
  run: SRCRun_raw;
};

//#region Game
export type SRCGame_raw = {
  id: string;
  names: SRCGameNames_raw;
  assets: SRCGameAsstes_raw;
};

export type SRCGameNames_raw = {
  international: string;
  japanese: string;
  twitch: string;
};

export type SRCGameAsstes_raw = {
  ["cover-small"]: {
    uri: string;
  };
  ["trophy-1st"]: {
    uri: string;
  };
  ["trophy-2nd"]: {
    uri: string;
  };
  ["trophy-3rd"]: {
    uri: string;
  };
  ["trophy-4th"]: {
    uri: string;
  };
  background: {
    uri: string;
  };
};

export type Game = {
  id: string;
  game_name: string;
  game_background: string;
  game_cover: string;
  game_trophy_1: string;
  game_trophy_2: string;
  game_trophy_3: string;
  pbs: PB[];
};

export type PB = {
  game_id: string;
  id: string;
  place: number;
  category: string;
  time: string;
  yt_link: string;
  yt_embed_link: string | null;
  yt_thumbnail: string | null;
};
