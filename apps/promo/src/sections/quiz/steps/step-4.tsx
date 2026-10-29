"use client";

import { cn } from "@/lib/utils";
import { Check2 } from "@/icons";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useMetrika } from "@/hooks/use-metrika";

import handleQuizChange from "@/services/handleQuizChange";

export const materialsOptions = {
  panel: {
    title: "Ламинированные панели",
  },
  shpon: {
    title: "Натуральный Шпон / Эмаль",
  },
  metal: {
    title: "Металл / Латунь",
  },
  idk: {
    title: "Затрудняюсь ответить",
  },
};

const options = ["panel", "shpon", "metal", "idk"];

export const Step4 = () => {
  const [value, onChange] = useState<string[]>([]);
  // const m = useMetrika();
  const handleMaterialsChange = (option: string) => {
    handleQuizChange(
      option,
      value,
      onChange,
      materialsOptions,
      "materialsOptions",
      4,
      true,
    );
  };

  return (
    <div className="flex h-full flex-col xl:pt-5">
      <div className="align-center mb-3 flex w-full flex-col gap-1 md:mb-2 md:flex-row md:items-center md:justify-between">
        <p className="text-small max-w-[574px] leading-[20px] xl:text-2xl xl:leading-tight">
          <b>Какие материалы в&nbsp;мебели для Вас предпочтительны?</b>
        </p>
        {/* <div
          className="flex w-full max-w-max items-center gap-2 bg-[#d24a431a] px-1 py-0.5 sm:w-fit"
          style={{
            border: "1px solid rgba(210, 74, 67, 0.6)",
          }}
        >
          <CircleCheck className="h-4 w-4 stroke-[3px]" />
          <span className="text-[12px] text-[#6c6c6c]">
            Выберите один или несколько вариантов
          </span>
        </div> */}
      </div>
      <ScrollArea className="flex-grow">
        <div className="grid grid-cols-12 gap-4 pb-10">
          <div className="col-span-12 space-y-4 xl:col-span-6">
            {options.map((option: any) => (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center gap-3 border px-3 py-4 xl:px-5 xl:py-6",
                  value.includes(option) && "border-accent",
                )}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  name="materials"
                  value={option}
                  className="hidden"
                  onChange={() => handleMaterialsChange(option)}
                />
                <div
                  className={cn(
                    "relative h-5 w-5 shrink-0 border-2 xl:h-6 xl:w-6",
                    value.includes(option)
                      ? "border-accent"
                      : "border-dark-500",
                  )}
                >
                  {value.includes(option) && (
                    <Check2 className="absolute left-1/2 top-1/2 h-[8px] w-[12px] -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                <span className="text-sm xl:text-lg">
                  {
                    materialsOptions[option as keyof typeof materialsOptions]
                      ?.title
                  }
                </span>
              </label>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
