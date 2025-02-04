import { ReactElement, ReactNode } from "react";
import { cn } from "../Utils/Helpers";

type Children = {
  children: ReactNode;
  className?: string;
};

export default function Container({
  children,
  className,
}: Children): ReactElement {
  return (
    <div className={cn("p-5 md:px-10 pb-20 md:py-8 space-y-8", className)}>
      {children}
    </div>
  );
}
