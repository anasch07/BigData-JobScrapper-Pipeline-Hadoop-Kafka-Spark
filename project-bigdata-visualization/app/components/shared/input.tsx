import { ChangeEventHandler, FC } from "react";

interface InputProps {
  label: string;
  placeholder: string;
  value: string | number;
  type: "text" | "number";
  onChange?: ChangeEventHandler;
}

const Input: FC<InputProps> = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base text-gray-500">{label}</label>
      <input
        className="border border-gray-300 text-sm bg-gray-200 rounded-lg px-3 py-2 shadow"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
};

export default Input;
