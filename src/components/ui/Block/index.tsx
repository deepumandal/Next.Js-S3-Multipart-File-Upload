import { Slot } from "@radix-ui/react-slot";
import { CSSProperties, forwardRef, JSX } from "react";
import { AnyType } from "@AppTypes/AnyType";
import { CommonProps } from "@Config/ui/asElement";
import { cn } from "@Utils/ClassName";

type BlockProps = Omit<CommonProps<"block">, "children"> & {
  children?: AnyType;
  asChild?: boolean;
  "data-social"?: string;
  style?: CSSProperties;
};

const Block = forwardRef<AnyType, BlockProps>(
  (
    {
      children = "",
      className,
      id,
      ariaLabel,
      ariaDescribedBy,
      ariaLive,
      role,
      asElement: Element = "div",
      border,
      asChild,
      ...rest
    }: BlockProps,
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
        className={cn(border && "app-border block w-full", className)}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Block.displayName = "Block";
export { type BlockProps, Block };
