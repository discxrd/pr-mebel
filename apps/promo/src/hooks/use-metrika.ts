"use client";
import { YandexMetrikaId } from "@/scripts";
import { useCallback, useEffect, useState } from "react";

export type Goal =
  | "promo/designer-form/submit"
  | "promo/pages/thanks"
  | "promo/modal-form/submit"
  | "promo/phone/click"
  | "promo/phone/whatsapp"
  | "promo/phone/order-call"
  | "promo/quiz/step/1"
  | "promo/quiz/step/1/kitchen"
  | "promo/quiz/step/1/main-room"
  | "promo/quiz/step/1/bedroom"
  | "promo/quiz/step/1/childern"
  | "promo/quiz/step/1/bathroom"
  | "promo/quiz/step/1/custom"
  | "promo/quiz/step/2"
  | "promo/quiz/step/2/modern"
  | "promo/quiz/step/2/classic"
  | "promo/quiz/step/2/neoclassic"
  | "promo/quiz/step/2/loft"
  | "promo/quiz/step/2/other"
  | "promo/quiz/step/2/consultation-needed"
  | "promo/quiz/step/3"
  | "promo/quiz/step/3/has-design-project"
  | "promo/quiz/step/3/has-photos"
  | "promo/quiz/step/3/in-progress"
  | "promo/quiz/step/3/no-design-project"
  | "promo/quiz/step/4"
  | "promo/quiz/step/4/panel"
  | "promo/quiz/step/4/shpon"
  | "promo/quiz/step/4/metal"
  | "promo/quiz/step/4/idk"
  | "promo/quiz/step/5"
  | "promo/quiz/step/5/not-started"
  | "promo/quiz/step/5/work-in-progress"
  | "promo/quiz/step/5/finish"
  | "promo/quiz/step/5/idk"
  | "promo/quiz/step/6"
  | "promo/quiz/step/6/asap"
  | "promo/quiz/step/6/3-months"
  | "promo/quiz/step/6/6-months"
  | "promo/quiz/step/6/idk"
  | "promo/quiz/submit"
  | "promo/projects/1"
  | "promo/projects/2"
  | "promo/projects/3"
  | "promo/projects/4"
  | "promo/projects/5"
  | "promo/projects/6"
  | "promo/catalog/1"
  | "promo/catalog/2"
  | "promo/catalog/3"
  | "promo/catalog/4"
  | "promo/catalog/5"
  | "promo/catalog/6"


;

export const useMetrika = () => {
  const [ready, setReady] = useState(false);

  const handleTrackEvent = useCallback(
    (event: Goal) => {
      if (!ready) return;

      window.ym?.(YandexMetrikaId, "reachGoal", event);
    },
    [ready],
  );

  useEffect(() => {
    setReady(true);
  }, []);

  return {
    track: handleTrackEvent,
  };
};
