import React from "react";
import Image from "next/image";
import { Game } from "@/pages/api/src.types";
import styles from "@/styles/Home.module.css";

const Game = (game: Game) => {
  const getTrophy = React.useCallback(
    (place: number) => {
      switch (place) {
        case 1:
          return game.game_trophy_1;
        case 2:
          return game.game_trophy_2;
        case 3:
          return game.game_trophy_3;
        default:
          return undefined;
      }
    },
    [game.game_trophy_1, game.game_trophy_2, game.game_trophy_3]
  );

  return (
    <section
      key={game.id}
      id={game.id}
      className={styles.section}
      style={{
        backgroundImage: `url(${game.game_background}`,
      }}
    >
      <div className={styles.center}>
        <h1>{game.game_name}</h1>
        <div className={styles.grid}>
          {game.pbs.map((pb) => (
            <div key={pb.id} className={styles.card}>
              {pb.yt_thumbnail && (
                <Image alt="" src={pb.yt_thumbnail} height={150} width={300} />
              )}
              <span>
                {getTrophy(pb.place) && (
                  <Image
                    alt={"trophy for place " + pb.place}
                    src={getTrophy(pb.place)!}
                    height={13}
                    width={13}
                  />
                )}
                {} {pb.place}. {pb.category} - {pb.time}
              </span>
              <p>
                <a href="https://www.speedrun.com" target="src">
                  speedrun.com
                </a>
              </p>
              <p>
                <a href={pb.yt_link} target="yt">
                  youtube.com
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Game;
