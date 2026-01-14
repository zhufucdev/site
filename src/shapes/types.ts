
export const supportedShapes = [
  "clover",
  "elevenSidedStar",
  "sixSidedStar",
  "tiltedOval",
  "tiltedPentagon",
  "tiltedRectangle",
] as const;
export type SupportedShape = (typeof supportedShapes)[number];
