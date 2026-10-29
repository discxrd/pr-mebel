"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import StepComponent from "./step-index";

import handleQuizChange from "@/services/handleQuizChange";
export const styleOptions = {
  modern: {
    id: "1",
    title: "Современный",
    image: "/quiz/style/modern2.jpg",
  },
  classic: {
    id: "2",
    title: "Классический",
    image: "/quiz/style/classic.jpg",
  },
  neoclassic: {
    id: "3",
    title: "Неоклассика",
    image: "/quiz/style/neoclassic.jpg",
  },
  loft: {
    id: "4",
    title: "Лофт",
    image: "/quiz/style/loft.jpg",
  },
  other: {
    id: "5",
    title: "Другой",
    image: "/quiz/style/other.jpg",
  },
  "consultation-needed": {
    id: "6",
    title: "Нужна консультация",
    image: "/quiz/style/other.jpg",
  },
};

const options = [
  "modern",
  "classic",
  "neoclassic",
  "loft",
  "other",
  "consultation-needed",
];

export type QuizOption =
  | "modern"
  | "classic"
  | "neoclassic"
  | "loft"
  | "other"
  | "consultation-needed";

export const Step2 = () => {
  const [selected, setSelected] = useState<string[]>([]);
  // const m = useMetrika();
  const handleMaterialsChange = (option: string) => {
    handleQuizChange(
      option,
      selected,
      setSelected,
      styleOptions,
      "stylesStorage",
      2,
      true,
    );
  };

  return (
    <div className="flex h-full flex-col xl:pt-5">
      <div className="align-center mb-3 flex w-full flex-col gap-1 leading-[20px] xl:flex-row xl:items-center xl:justify-between xl:leading-tight">
        <p className="text-small max-w-[574px] xl:text-2xl">
          <b>Какой стиль интерьера вам нравится больше всего?</b>
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-grow pb-10">
        <StepComponent
          furnitureOptions={styleOptions}
          options={options}
          selected={selected}
          handleChange={handleMaterialsChange}
        />
      </ScrollArea>
    </div>
  );
};
