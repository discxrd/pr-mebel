import { YandexMetrikaId } from "@/scripts";

type OptionKey = string;

interface OptionItem {
  title: string;
  // можно добавить другие поля, если нужно
}

export default function handleQuizChange(
  option: OptionKey,
  selected: OptionKey[],
  setSelected: (val: OptionKey[]) => void,
  optionsMap: Record<OptionKey, OptionItem>,
  storageKey: string,
  stepNumber: number,
  multiple: boolean = true,
) {
  let updated: OptionKey[];

  if (multiple) {
    // Множественный выбор
    if (selected.includes(option)) {
      updated = selected.filter((v) => v !== option);
    } else {
      updated = [...selected, option];
    }
  } else {
    // Одиночный выбор
    updated = [option];
  }

  // Обновляем состояние
  setSelected(updated);

  // Преобразуем ключи в названия
  const updatedTitles = updated.map((opt) => optionsMap[opt]?.title);

  // Сохраняем в localStorage
  localStorage.setItem(storageKey, JSON.stringify(updatedTitles));

  // Отправляем событие в Яндекс.Метрику
  if (typeof window !== "undefined" && window.ym) {
    window.ym(
      YandexMetrikaId,
      "reachGoal",
      `promo/quiz/step/${stepNumber}/${option}`,
    );
  }
}
