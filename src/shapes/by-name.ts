import clover from "../images/Clover.svg?raw";
import elevenSidedStar from "../images/ElevenSidedStar.svg?raw";
import sixSidedStar from "../images/SixSidedStar.svg?raw";
import tiltedOval from "../images/TiltedOval.svg?raw";
import tiltedPentagon from "../images/TiltedPentagon.svg?raw";
import tiltedRectangle from "../images/TiltedRectangle.svg?raw";
import type { SupportedShape } from "./types";

export const shapeByName: { [key in SupportedShape]: typeof clover } = {
  clover,
  elevenSidedStar,
  sixSidedStar,
  tiltedOval,
  tiltedPentagon,
  tiltedRectangle,
};
