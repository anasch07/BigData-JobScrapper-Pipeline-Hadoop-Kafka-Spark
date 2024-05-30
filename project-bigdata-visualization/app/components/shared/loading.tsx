import clsx from "clsx";
import Image from "next/image";
import { FC } from "react";

interface LoadginScreepProps {
  isVisible: boolean;
}
const LoadingScreen: FC<LoadginScreepProps> = ({ isVisible }) => {
  return (
    <div
      className={clsx(
        "z-100 fixed flex justify-center items-center top-0 left-0 w-screen h-screen bg-blue-300 overflow-hidden transition-all ease duration-300",
        { "-translate-x-full": !isVisible }
      )}
    >
      <div className="h-32 w-32 relative">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/QR_icon.svg/1024px-QR_icon.svg.png"
          fill
          alt="logo"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
