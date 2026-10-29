"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
// import { useMetrika } from "@/hooks/use-metrika";
import { cn } from "@/lib/utils";
import handleQuizChange from "@/services/handleQuizChange";
import { useState } from "react";

export const stageOptions = {
  "not-started": {
    title: "Еще не начали",
  },
  "work-in-progress": {
    title: "Ведутся работы",
  },
  finish: {
    title: "Ремонт окончен",
  },
  idk: {
    title: "Затрудняюсь ответить",
  },
};

const options = ["not-started", "work-in-progress", "finish", "idk"];

export const Step5 = () => {
  const [value, onChange] = useState<string[]>([]);
  // const m = useMetrika();
  const handleMaterialsChange = (option: string) => {
    handleQuizChange(
      option,
      value,
      onChange,
      stageOptions,
      "stageOptions",
      5,
      false,
    );
  };
  return (
    <div className="flex h-full flex-col xl:pt-5">
      <p className="text-small mb-3 max-w-[574px] leading-[20px] xl:text-2xl xl:leading-tight">
        <b>На какой стадии ремонта находится помещение?</b>
      </p>
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
                  type="radio"
                  checked={value.includes(option)}
                  name="stage"
                  value={option}
                  className="hidden"
                  onChange={() => handleMaterialsChange(option)}
                />
                <div
                  className={cn(
                    "relative h-5 w-5 shrink-0 rounded-full border before:absolute before:left-1/2 before:top-1/2 before:h-3 before:w-3 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full",
                    value.includes(option)
                      ? "border-accent before:bg-accent"
                      : "border-dark-500",
                  )}
                />
                <span className="text-sm xl:text-lg">
                  {stageOptions[option as keyof typeof stageOptions]?.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
