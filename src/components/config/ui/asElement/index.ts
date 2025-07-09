import { AriaRole, HtmlHTMLAttributes, ReactNode } from "react";
import { ClassType } from "@Utils/ClassName";
import { ColorVariantsType } from "../colors-variants";

type asContainerType = "header" | "footer" | "nav" | "main";
type asFlexType = "div" | "section" | "article" | "aside";
type asBlockType = "div" | "section" | "article" | "aside" | "nav";
type asGridType = "div" | "section" | "article" | "aside";
type asGridItemType = "div";
type asHeadingType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type asTextType = "p" | "span" | "strong";

type asTypographyType = asHeadingType | asTextType;

type ElementTypeMap = {
  container: asContainerType;
  flex: asFlexType;
  block: asBlockType;
  Grid: asGridType;
  Typography: asTypographyType;
  GridItem: asGridItemType;
};
type AsElementType<T extends keyof ElementTypeMap> = ElementTypeMap[T];
type ElementTypeMapKeys = keyof ElementTypeMap;
type ElementKeysTypeUnion = ElementTypeMap[ElementTypeMapKeys];
type AllElementTypes = AsElementType<ElementTypeMapKeys>;

interface P<T extends keyof ElementTypeMap> {
  children: ReactNode;
  className?: ClassType;
  asElement?: AsElementType<T>;
  id?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaLive?: "off" | "polite" | "assertive";
  role?: AriaRole;
  border?: boolean;
  BackgroundColor?: ColorVariantsType;
}

type CommonProps<T extends keyof ElementTypeMap> = P<T>;

type CommonPropsExtendedHtmlAttribute<T extends keyof ElementTypeMap> = P<T> &
  HtmlHTMLAttributes<HTMLElement>;

export {
  type CommonProps,
  type CommonPropsExtendedHtmlAttribute,
  type asContainerType,
  type asFlexType,
  type asBlockType,
  type asGridType,
  type asGridItemType,
  type asTypographyType,
  type asHeadingType,
  type asTextType,

  // Element type map
  type ElementTypeMap,
  type AsElementType,
  type ElementKeysTypeUnion,
  type AllElementTypes,
};
