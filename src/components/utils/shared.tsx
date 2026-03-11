import React, { useState } from "react";
import isologo from "./files/isologo.png";
import favicon from "./files/favicon.png";
import { User, Users } from "lucide-react";
import { GameMode, ClassNameType } from "./types";

interface GLProps {
  width?: number;
  height?: number;
  className?: string;
}

const GLLogo: React.FC<GLProps> = ({ width, height, className }) => {
  return (
    <img
      className={className}
      width={width ?? 50}
      height={height ?? 50}
      src={isologo}
    />
  );
};

const GLIcon: React.FC<GLProps> = ({ width, height, className }) => {
  return (
    <img className={className} width={width} height={height} src={favicon} />
  );
};

const GModeSwitcherMobile = ({
  setGameMode,
}: {
  setGameMode: (gameMode: GameMode) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setGameMode(isChecked ? "single" : "multiplayer");
  };

  return (
    <>
      <label className="themeSwitcherThree relative inline-flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />

        <div className="shadow-card flex h-[40px] w-[72px] items-center justify-center rounded-md bg-white">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded ${
              !isChecked ? "bg-primary text-white" : "text-body-color"
            }`}
          >
            <User className="w-5 h-5" />
          </span>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded ${
              isChecked ? "bg-green-500 text-white" : "text-body-color"
            }`}
          >
            <Users className="w-5 h-5" />
          </span>
        </div>
      </label>
    </>
  );
};

export { GLLogo, GLIcon, GModeSwitcherMobile };
