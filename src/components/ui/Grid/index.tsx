import { forwardRef, JSX } from "react";
import { AnyType } from "@AppTypes/AnyType";
import { CommonProps } from "@Config/ui/asElement";
import { color } from "@UI/Common";
import { ClassType, cn } from "@Utils/ClassName";
import {
  gridColumnsObj,
  gapObj,
  GridColumnsType,
  GapType,
} from "./utils/style-object";

type GridProps = CommonProps<"Grid"> & {
  columns: GridColumnsType;
  gap?: GapType;
  gridLines?: boolean;
  // aspectRatio
};

const Grid = forwardRef<AnyType, GridProps>(
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
      columns,
      gap = "0",
      border,
      gridLines,
      BackgroundColor = "default",
      ...rest
    }: GridProps,
    ref,
  ): JSX.Element => (
    <Element
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-live={ariaLive}
      role={role}
      className={cn(
        "grid",
        gridLines && "gridLines",
        gridColumnsObj[columns],
        gapObj[gap],
        border && "app-border",
        color[BackgroundColor] as ClassType,
        className,
      )}
      {...rest}
    >
      {children}
    </Element>
  ),
);

Grid.displayName = "Grid";
export { type GridProps, Grid };
