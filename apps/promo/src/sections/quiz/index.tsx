"use client";

import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedTitle } from "@/components/animated-title";
import { Step1 } from "./steps/step-1";
import { Step2 } from "./steps/step-2";
import { Step3 } from "./steps/step-3";
import { Step4 } from "./steps/step-4";
import { Step5 } from "./steps/step-5";
import { Step6 } from "./steps/step-6";
import { DesignerMessage } from "./designer-message";
import { FinalStep } from "./steps/final-step";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/card";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { YandexMetrikaId } from "@/scripts";

const stepComponents = [
  <Step1 key="step-1" />,
  <Step2 key="step-2" />,
  <Step3 key="step-3" />,
  <Step4 key="step-4" />,
  <Step5 key="step-5" />,
  <Step6 key="step-6" />,
];

export interface IDesignerMessage {
  id: number;
  name: string;
  position: string;
  comment: string;
}

const designerMessage: IDesignerMessage[] = [
  {
    id: 1,
    name: "Алена Ивлева",
    position: "дизайнер мебели",
    comment:
      "Мы производим корпусную мебель любой сложности на заказ по индивидуальному проекту, в нашем портфолио 300+ проектов",
  },
  {
    id: 2,
    name: "Алена Ивлева",
    position: "дизайнер мебели",
    comment:
      "Наши дизайнеры работают со всеми стилями, воплотят любую идею и создадут мебель, которая идеально впишется в ваш интерьер",
  },
  {
    id: 3,
    name: "Алена Ивлева",
    position: "дизайнер мебели",
    comment:
      "Если у вас уже есть проект, то мы создадим мебель строго в соответствии с документом. Если нет — наши дизайнеры создадут для вас индивидуальный проект, учитывая все ваши пожелания и особенности помещения",
  },
  {
    id: 4,
    name: "Алена Ивлева",
    position: "дизайнер мебели",
    comment:
      "Мы работаем только с премиальными материалами, которые прослужат долгие годы. Каждый материал имеет свои уникальные свойства — мы поможем выбрать оптимальный вариант для вашего интерьера и образа жизни",
  },
  {
    id: 5,
    name: "Алена Ивлева",
    position: "дизайнер мебели",
    comment:
      "Знание стадии ремонта позволит нам точнее спланировать процесс изготовления и установки мебели. Мы можем подстроиться под любой этап работ, обеспечивая идеальную интеграцию мебели в ваш интерьер",
  },
  {
    id: 6,
    name: "Алена Ивлева",
    position: "дизайнер мебели",
    comment:
      "Мы ценим ваше время и можем работать в различных временных рамках. От экспресс-решений до длительных проектов с детальной проработкой — мы гарантируем качество в любые сроки",
  },
];

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState<number[]>([]);
  const breakpoints = {
    mobile: useMediaQuery("(max-width: 768px)"),
    tablet: useMediaQuery("(min-width: 769px) and (max-width: 1023px)"),
    desktop: useMediaQuery("(min-width: 1024px) and (max-width: 1919px)"),
    large: useMediaQuery("(min-width: 1920px)"),
  };

  const headerHeight = breakpoints.mobile
    ? 60
    : breakpoints.tablet
      ? 80
      : breakpoints.desktop
        ? 100
        : 250;

  const scrollToQuiz = () => {
    const el = document.getElementById("quiz-step");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleAnalytics = (step: number) => {
    if (!visited.includes(step)) {
      // m.track(("promo/quiz/step/" + step + 1) as Goal);
      setVisited([...visited, step]);
    }
  };

  const handleNext = () => {
    if (step > allSteps.length - 1) {
      return;
    }
    scrollToQuiz();
    setStep(step + 1);
    handleAnalytics(step + 1);

    if (typeof window !== "undefined" && window.ym) {
      window.ym(YandexMetrikaId, "reachGoal", "promo/quiz/step/" + (step + 1));
      console.log("reachGoal", "promo/quiz/step/" + (step + 1));
    }
  };

  const handleBack = () => {
    if (step === 0) {
      return;
    }
    scrollToQuiz();
    setStep(step - 1);
  };
  const allSteps = [...stepComponents, <FinalStep key="final-step" />];

  return (
    <div
      className="flex h-full grid-cols-12 flex-col bg-white pt-3 sm:max-h-[650px] md:grid xl:h-full xl:pt-0"
      id="quiz-step"
    >
      {allSteps.length - 1 !== step && (
        <DesignerMessage
          designerMessage={designerMessage[step]}
          className="flex xl:block"
        />
      )}
      <main
        className={`relative col-span-12 h-full ${allSteps.length - 1 !== step ? "sm:col-span-9" : "sm:col-span-full"}`}
      >
        {allSteps.length - 1 !== step && (
          <div className="py-5 xl:py-0">
            <Progress
              value={((step + 1) / allSteps.length) * 100}
              className="absolute z-10"
            />
          </div>
        )}

        <Card className="relative flex h-full flex-col gap-0 bg-[#ffffff00] xl:grid xl:h-full xl:grid-rows-[1fr_auto]">
          <div className="relative h-full w-full flex-grow overflow-hidden">
            {allSteps.map((stepComponent, i) => {
              const isActive = step === i;
              return (
                <div
                  key={`step-${i}`}
                  className={cn(
                    "absolute inset-0 transition-all ease-out",
                    isActive
                      ? "pointer-events-auto visible translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-8 opacity-0",
                  )}
                  style={{
                    transition: isActive
                      ? i === allSteps.length - 1
                        ? "opacity 200ms ease-out 500ms, transform 400ms ease-out"
                        : "opacity 500ms ease-out 500ms, transform 1000ms ease-out"
                      : i === allSteps.length - 1 && step < allSteps.length - 1
                        ? "opacity 0ms ease-out, transform 300ms ease-out"
                        : "opacity 0ms ease-out, transform 1000ms ease-out",
                  }}
                >
                  {stepComponent}
                </div>
              );
            })}
          </div>
          <div className="flex flex-shrink-0 flex-col gap-5">
            <div
              className={`flex w-full items-end ${allSteps.length - 1 !== step ? "justify-between" : "justify-end"}`}
            >
              {allSteps.length - 1 !== step && (
                <p className="mb-1 hidden text-dark-700 xl:block">
                  Вопрос {step + 1}/6
                </p>
              )}

              <div
                className={`relative flex w-full gap-2 xl:top-0 ${allSteps.length - 1 !== step ? "top-[-40px] justify-between xl:max-w-[332px]" : "top-0 justify-end xl:max-w-[200px]"}`}
              >
                <Button
                  type="button"
                  className="w-[55px] xl:w-[80px]"
                  onClick={handleBack}
                >
                  <ArrowRight
                    color="#C3C3C3"
                    className="inline h-6 w-6 rotate-180"
                    style={{ width: "24px", height: "24px" }}
                  />
                </Button>
                {designerMessage[step] && (
                  <Button
                    type="button"
                    variant="accent"
                    className="w-full text-[16px] uppercase xl:w-[230px]"
                    onClick={handleNext}
                  >
                    Далее{" "}
                    <ArrowRight
                      className="inline w-5"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export const QuizSection = () => {
  return (
    <div
      className="w-full scroll-mt-[60px] bg-dark-100 sm:scroll-mt-[0px]"
      id="quiz"
    >
      <Section className="px-0 pb-0 xl:container xl:px-0 xl:pb-0">
        <div className="xl:px-20 xl:py-5">
          <AnimatedTitle as="h2" className="px-4 text-3xl font-medium xl:px-0 xl:text-4xl">
            Получите индивидуальное предложение по изготовлению корпусной мебели
            для вашего дома
          </AnimatedTitle>
          <AnimatedTitle as="h3" className="mb-10 mt-2 px-4 text-xl text-dark-700 xl:px-0 xl:text-2xl">
            Ответьте на 6 вопросов и{" "}
            <span className="font-bold">
              рассчитайте стоимость изготовления
            </span>{" "}
            мебели
          </AnimatedTitle>
          <div className="h-[calc(100vh-64px)] overflow-hidden px-5 xl:h-[650px] xl:px-0">
            <Quiz />
          </div>
        </div>
      </Section>
    </div>
  );
};
