import clover from "../images/Clover.svg";
import elevenSidedStar from "../images/ElevenSidedStar.svg";
import sixSidedStar from "../images/SixSidedStar.svg";
import tiltedOval from "../images/TiltedOval.svg";
import tiltedPentagon from "../images/TiltedPentagon.svg";
import tiltedRectangle from "../images/TiltedRectangle.svg";
import type { SupportedShape } from "./types";

export const shapeByName: { [key in SupportedShape]: typeof clover } = {
  clover,
  elevenSidedStar,
  sixSidedStar,
  tiltedOval,
  tiltedPentagon,
  tiltedRectangle,
};
