"use client";
import { useState } from "react";
import StepComponent from "./step-index";
import { ScrollArea } from "@/components/ui/scroll-area";
import handleQuizChange from "@/services/handleQuizChange";
export const furnitureOptions = {
  kitchen: {
    id: "1",
    title: "Кухня",
    image: "/quiz/furniture/1.jpg",
  },
  "main-room": {
    id: "2",
    title: "Гостиная",
    image: "/quiz/furniture/2.jpg",
  },
  bedroom: {
    id: "3",
    title: "Шкафы и Гардеробные",
    image: "/quiz/furniture/3.jpg",
  },
  childern: {
    id: "4",
    title: "Детская",
    image: "/quiz/furniture/4.jpg",
  },
  bathroom: {
    id: "5",
    title: "Ванная",
    image: "/quiz/furniture/5.jpg",
  },
  custom: {
    id: "6",
    title: "Нужно под ключ",
    image: "/quiz/furniture/6.jpg",
  },
};

const options = [
  "kitchen",
  "main-room",
  "bedroom",
  "childern",
  "bathroom",
  "custom",
];

export type QuizOption =
  | "kitchen"
  | "main-room"
  | "bedroom"
  | "childern"
  | "bathroom"
  | "custom";

export const Step1 = () => {
  const [selected, setSelected] = useState<string[]>([]);
  // const storage = localStorage.setItem("mainStorage", JSON.stringify(selected));
  const handleMaterialsChange = (option: string) => {
    handleQuizChange(
      option,
      selected,
      setSelected,
      furnitureOptions,
      "modelsStorage",
      1,
      true,
    );
  };

  return (
    <div className="flex h-full flex-col xl:pt-5">
      <div className="align-center mb-3 flex w-full flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <p className="text-small max-w-[574px] lg:text-2xl">
          <b>Какая мебель Вам нужна?</b>
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-grow pb-10">
        <StepComponent
          furnitureOptions={furnitureOptions}
          options={options}
          selected={selected}
          handleChange={handleMaterialsChange}
        />
      </ScrollArea>
    </div>
  );
};
