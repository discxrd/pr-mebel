import { cn } from "@/lib/utils";

export const Card = ({
  children,
  className,
  ...rest
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "bg-white px-5 pb-3 pt-[5px] md:px-10 md:pt-[10px]",
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);
