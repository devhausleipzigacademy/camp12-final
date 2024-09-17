import { useState } from "react";

type Props = {
  text: string;
};

export default function WeekDayItem({ text }: Props) {
  const [isActive, setActive] = useState<boolean>(false);

  function handleClick() {
    setActive(!isActive);
  }

  return (
    <button
      onClick={handleClick}
      className={`p-1 h-8 aspect-square text-xs text-center bg-zinc-200 rounded-full ${
        isActive ? "bg-blue-200" : ""
      }`}
    >
      {text}
    </button>
  );
}
