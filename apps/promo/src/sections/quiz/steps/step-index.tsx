"use client";

import { cn } from "@/lib/utils";
import { CircleCheck } from "@/icons";
import Image from "next/image";

interface StepComponentProps {
  furnitureOptions: Record<
    string,
    { id: string; title: string; image: string }
  >;
  options: string[];
  selected: string[];
  handleChange: (option: any) => void;
}

const StepComponent = ({
  furnitureOptions,
  options,
  selected,
  handleChange,
}: StepComponentProps) => {
  return (
    <div className="flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:gap-x-5 xl:gap-y-1">
        {options.map((option) => (
          <label key={option} className="relative cursor-pointer">
            <CircleCheck
              className={cn(
                "absolute right-3 top-3 z-20 h-6 w-6 transition-opacity duration-100",
                selected.includes(option) ? "opacity-100" : "opacity-0",
              )}
            />
            <input
              type="checkbox"
              name="furniture"
              value={option}
              checked={selected.includes(option)}
              className="hidden"
              onChange={() => handleChange(option)}
            />

            <div
              className={cn(
                "relative mb-1 aspect-video w-full",
                selected.includes(option) && "border border-accent",
              )}
            >
              {furnitureOptions[option as keyof typeof furnitureOptions]
                ?.title === "Нужна консультация" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm backdrop-saturate-150">
                  <span className="text-[90px] font-medium text-[#f9f9f9] md:text-[150px]">
                    ?
                  </span>
                </div>
              )}

              <Image
                src={
                  furnitureOptions[option as keyof typeof furnitureOptions]
                    ?.image || ""
                }
                alt={
                  furnitureOptions[option as keyof typeof furnitureOptions]
                    ?.title || ""
                }
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <span className="text-sm xl:text-[16px]">
              {furnitureOptions[option as keyof typeof furnitureOptions]?.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StepComponent;
