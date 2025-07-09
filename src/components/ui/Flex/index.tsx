import { Slot } from "@radix-ui/react-slot";
import { AriaRole, CSSProperties, forwardRef, JSX } from "react";
import { AnyType } from "@AppTypes/AnyType";
import { CommonProps } from "@Config/ui/asElement";
import { color } from "@UI/Common";
import { type ClassType, cn } from "@Utils/ClassName";
import {
  FlexDirectionType,
  FlexElementType,
  AlignContentType,
  AlignItemsType,
  JustifyContentType,
  alignContentObj,
  alignItemsObj,
  directionObj,
  justifyObj,
} from "./utils/style-object";

type FlexProps = CommonProps<"flex"> & {
  flexDirection?: FlexDirectionType;
  justifyContent?: JustifyContentType;
  alignItems?: AlignItemsType;
  alignContent?: AlignContentType;
  asChild?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

const Flex = forwardRef<AnyType, FlexProps>(
  (
    {
      children,
      className,
      id,
      ariaLabel,
      ariaDescribedBy,
      ariaLive,
      role,
      asElement: Element = "div",
      flexDirection = "row",
      justifyContent = "flex-start",
      alignItems = "flex-start",
      alignContent = "flex-start",
      BackgroundColor = "default",
      border,
      asChild,
      ...rest
    }: FlexProps,
    ref,
  ): JSX.Element => {
    const Comp = asChild ? Slot : Element;
    return (
      <Comp
        ref={ref}
        id={id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-live={ariaLive}
        role={role}
        className={cn(
          "flex",
          border && "app-border",
          justifyObj[justifyContent],
          directionObj[flexDirection],
          alignItemsObj[alignItems],
          alignContentObj[alignContent],

          color[BackgroundColor] as ClassType,

          className,
        )}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Flex.displayName = "Flex";

export {
  Flex,
  type FlexProps,
  type AlignContentType,
  type AlignItemsType,
  type AriaRole,
  type FlexDirectionType,
  type FlexElementType,
  type JustifyContentType,
};
