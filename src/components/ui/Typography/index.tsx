import { Slot } from "@radix-ui/react-slot";
import { CSSProperties, JSX } from "react";
import { CommonProps } from "@Config/ui/asElement";
import { ColorVariantsType } from "@Config/ui/colors-variants";
import { cn } from "@Utils/ClassName";
import {
  HeadingVariants,
  TextVariants,
  asElementObject,
} from "./utils/TypographyClasses";

type variantsType = ColorVariantsType;

type TypographyProps = Omit<CommonProps<"Typography">, "BackgroundColor"> & {
  variants?: variantsType;
  style?: CSSProperties;
  asChild?: boolean;
};

const isHeading = (T: string) =>
  ["h1", "h2", "h3", "h4", "h5", "h6"].includes(T);

const Typography = ({
  children,
  className,
  id,
  ariaLabel,
  ariaDescribedBy,
  ariaLive,
  role,
  asElement: Element = "span",
  border,
  asChild,
  variants = "default",
  ...rest
}: TypographyProps): JSX.Element => {
  const Comp = asChild ? Slot : Element;

  console.log("Typography", asElementObject[Element]);
  return (
    <Comp
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-live={ariaLive}
      role={role}
      className={cn(
        "flex",
        asElementObject[Element],
        border && "app-border",
        isHeading(Element)
          ? HeadingVariants[variants as keyof typeof HeadingVariants]
          : TextVariants[variants as keyof typeof HeadingVariants],
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
};

export { type TypographyProps, Typography };
