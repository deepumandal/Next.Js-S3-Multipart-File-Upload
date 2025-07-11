import { forwardRef, JSX } from "react";
import { AnyType } from "@AppTypes/AnyType";
import { CommonProps } from "@Config/ui/asElement";
import { color } from "@UI/Common";
import { type ClassType, cn } from "@Utils/ClassName";

// type GridItemProps = {
//   children: ReactNode;
//   className?: ClassType;
//   id?: string;
//   ariaLabel?: string;
//   ariaDescribedBy?: string;
//   ariaLive?: "off" | "polite" | "assertive";
//   role?: AriaRole;
//   border?: boolean;
// };
type GridItemProps = CommonProps<"GridItem"> & object;

/**
 * GridItem component for individual grid items.
 *
 * @param {GridItemProps} props - The props for the GridItem component.
 * @returns {JSX.Element} The rendered grid item component.
 */
const GridItem = forwardRef<AnyType, GridItemProps>(
  (
    {
      children,
      className,
      id,
      ariaLabel,
      ariaDescribedBy,
      ariaLive,
      role = "region",
      BackgroundColor = "default",
      border,
      ...rest
    }: GridItemProps,
    ref,
  ): JSX.Element => (
    <div
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-live={ariaLive}
      role={role}
      className={cn(
        border && "app-border",
        color[BackgroundColor] as ClassType,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);

GridItem.displayName = "GridItem";

export { type GridItemProps, GridItem };
