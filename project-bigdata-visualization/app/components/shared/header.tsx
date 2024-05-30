import Image from "next/image";
import Link from "next/link";
import Button from "./button";

const Header = () => {
  return (
    <div className="flex flex-row w-full justify-center px-4 py-6">
      <div className="flex flex-row justify-between max-w-7xl w-full items-center">
        <div className="flex flex-row gap-6 items-center">
          <div className="h-8 w-8 relative">

          </div>
          <div className="px-5 py-2 text-xs bg-gray-200 rounded-lg text-slate-900 font-medium tracking-wider">
            BigData <span className="text-gray-400 w-10">{">"}</span>{" "}
            Visualization
          </div>
        </div>
        <div className="flex flex-row gap-6 ">
          <Link href="/">
            <Button label={"Overview"} variant="secondary" />
          </Link>
          <Button
            label={"Documentation"}
            onClick={() => {
              window.location.href =
                "https://github.com/anasch07";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
