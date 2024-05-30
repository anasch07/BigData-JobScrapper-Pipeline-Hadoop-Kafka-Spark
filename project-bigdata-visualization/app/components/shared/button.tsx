"use client";

import clsx from "clsx";
import { FC } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

const Button: FC<ButtonProps> = ({ label, onClick, variant = "primary" }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "cursor-pointer text-sm px-3 py-2 rounded-xl transition-all hover:-translate-y-1",
        {
          "bg-blue-400 bg-opacity-30 cursor-pointer text-blue-800 hover:shadow":
            variant === "primary",
        },
        {
          "text-gray-600 hover:bg-gray-300 font-light": variant === "secondary",
        }
      )}
    >
      <p>{label}</p>
    </div>
  );
};

export default Button;
