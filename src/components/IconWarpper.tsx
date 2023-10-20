import {cn} from "@nextui-org/react";

type IconWarpperProps = {
    children: any
    className: string
}
export const IconWrapper: React.FC<IconWarpperProps> = ({children, className}) => (
  <div className={cn(className, "flex items-center rounded-small justify-center w-7 h-7")}>
    {children}
  </div>
);