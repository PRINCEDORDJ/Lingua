import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { fonts } from "./fonts";

export const theme = {
  colors,
  spacing,
  fonts,
  ...typography,
};

export * from "./colors";
export * from "./spacing";
export * from "./typography";
export * from "./fonts";
