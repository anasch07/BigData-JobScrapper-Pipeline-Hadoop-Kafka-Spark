import clsx from "clsx";
import { FC, ReactNode } from "react";

interface CardProps {
  className?: string;
  children?: ReactNode;
}

const Card: FC<CardProps> = ({ className, children }) => {
  return (
    <div className={clsx("py-4 rounded-xl bg-white shadow-lg shadow-gray-200 border border-gray-300", className)}>
      {children}
    </div>
  );
};

export default Card;
