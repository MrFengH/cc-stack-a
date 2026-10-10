import { Composition } from "remotion";
import { Film } from "./Film";
import { FILM_FRAMES } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="NotaAltaFilm" component={Film} durationInFrames={FILM_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ voice: "v3" as const }} />
);
