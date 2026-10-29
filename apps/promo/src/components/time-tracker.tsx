"use client";

import { useEffect } from "react";
import { YandexMetrikaId } from "@/scripts";

export const TimeTracker = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const startTime = Date.now();

    const milestones = [
      { time: 30, goal: "time_30s", sent: false },
      { time: 60, goal: "time_60s", sent: false },
      { time: 90, goal: "time_90s", sent: false },
      { time: 120, goal: "time_120s", sent: false },
    ];

    const checkMilestones = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

      milestones.forEach((milestone) => {
        if (elapsedSeconds >= milestone.time && !milestone.sent) {
          milestone.sent = true;

          if (window.ym) {
            window.ym(YandexMetrikaId, "reachGoal", milestone.goal);
          }
          console.log(`[TimeTracker] Milestone goal reached: ${milestone.goal}`);
        }
      });

      const allSent = milestones.every((m) => m.sent);
      if (allSent) {
        clearInterval(intervalId);
        document.removeEventListener("visibilitychange", checkMilestones);
      }
    };

    const intervalId = setInterval(checkMilestones, 1000);
    document.addEventListener("visibilitychange", checkMilestones);

    const isElementInViewport = (el: HTMLElement | null) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    // Вспомогательная функция для определения и отправки цели
    const sendScreenshotGoal = (triggerType: string) => {
      const isModalOpen = !!document.querySelector('[role="dialog"]');

      const goal = isModalOpen ? "screenshot_modal" : "screenshot_main";

      if (window.ym) {
        window.ym(YandexMetrikaId, "reachGoal", goal);
      }

      console.log(`[TimeTracker] SUCCESS! Triggered by: ${triggerType} | Sent Goal: "${goal}"`, {
        isModalOpen,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Capture PrintScreen key immediately on KeyDown
      // (KeyUp doesn't fire when browser window loses focus because of system overlay)
      if (e.key === "PrintScreen") {
        sendScreenshotGoal(e.altKey ? "Alt + PrintScreen" : "PrintScreen (KeyDown)");
        return;
      }

      const hasModifiers = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
      const isFKey = e.key.startsWith("F");

      if (!hasModifiers && !isFKey) return;

      // e.code даёт физическую клавишу вне зависимости от языка (например: "KeyA", "Digit4")
      const code = e.code;

      // Список физических клавиш, зарезервированных браузерами для Ctrl+Shift (I, J, C, N, T, W, Q, R, B, O, M, K, P, E, D, A)
      // KeyA добавлена в reserved, так как Ctrl+Shift+A открывает "Поиск вкладок" в Chrome
      const reservedCodes = [
        "KeyI", "KeyJ", "KeyC", "KeyN", "KeyT", "KeyW", "KeyQ",
        "KeyR", "KeyB", "KeyO", "KeyM", "KeyK", "KeyP", "KeyE",
        "KeyD", "KeyA"
      ];

      // Список физических клавиш, зарезервированных браузерами для Ctrl (без Shift)
      const reservedCtrlSingle = [
        "KeyC", "KeyV", "KeyX", "KeyZ", "KeyA", "KeyF", "KeyS", "KeyP",
        "KeyR", "KeyT", "KeyW", "KeyN", "KeyL", "KeyO", "KeyD", "KeyU",
        "KeyG", "KeyH", "KeyK", "KeyJ"
      ];

      // Проверяем, что нажата буква (KeyA-KeyZ) или цифра (Digit0-Digit9)
      const isAlphaNumericCode = /^Key[A-Z]$|^Digit[0-9]$/.test(code);

      // 1. Безопасные буквы/цифры для Ctrl+Shift (Win/Linux) или Cmd+Shift (Mac)
      const isModifierShiftCombo =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        isAlphaNumericCode &&
        !reservedCodes.includes(code);

      // 2. Alt+PrintScreen (уже обработано выше в e.key === "PrintScreen", но оставляем для совместимости с кодами)
      const isAltPrintScreen = e.altKey && e.key === "PrintScreen";

      // 3. Свободные F-клавиши
      const isFreeF = ["F2", "F8", "F9"].includes(e.key);

      // 4. Ctrl/Cmd + Shift + F-клавиши
      const isCtrlShiftF = (e.ctrlKey || e.metaKey) && e.shiftKey && ["F2", "F8", "F9", "F10"].includes(e.key);

      // 5. Alt/Ctrl/Cmd + буква (без Shift) — цель hotkey_combo
      const isModifierSingleCombo =
        !e.shiftKey &&
        isAlphaNumericCode &&
        (e.altKey || e.ctrlKey || e.metaKey);

      // Логирование и отправка
      if (isModifierShiftCombo) {
        sendScreenshotGoal(`Ctrl/Cmd + Shift + ${code}`);
      } else if (isAltPrintScreen) {
        sendScreenshotGoal("Alt + PrintScreen");
      } else if (isFreeF) {
        sendScreenshotGoal(e.key);
      } else if (isCtrlShiftF) {
        sendScreenshotGoal(`Ctrl/Cmd + Shift + ${e.key}`);
      } else if (isModifierSingleCombo) {
        // Отдельная цель для одиночных модификаторов
        const goal = "hotkey_combo";
        if (window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", goal);
        }
        console.log(`[TimeTracker] Goal reached: ${goal} | Trigger: ${e.altKey ? "Alt" : e.ctrlKey ? "Ctrl" : "Cmd"} + ${code}`);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && reservedCodes.includes(code)) {
        console.warn(`[TimeTracker] Ignored reserved combo (browser default): Ctrl/Cmd + Shift + ${code}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", checkMilestones);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <div style={{ display: "none" }} id="time-tracker-marker" />;
};