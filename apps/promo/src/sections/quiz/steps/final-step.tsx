"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, FormEvent, MouseEvent, ChangeEvent } from "react";
import { sendToTelegram } from "@/server/full";
import { useRouter } from "next/navigation";

import styles from "../step.module.css";
import { YandexMetrikaId } from "@/scripts";
import { uploadFilesToR2 } from "@/server/upload-files";

interface FileUploadProps {
  name: string;
  required?: boolean;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setTotalSizeMB: React.Dispatch<React.SetStateAction<number>>;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  name,
  files,
  setFiles,
  setTotalSizeMB,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);

    e.target.value = "";
  };

  const fileLabel = () => {
    return "Добавить файл";
  };

  const totalSizeBytes = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  useEffect(() => {
    setTotalSizeMB(+totalSizeMB);
  }, [files]);

  return (
    <div className="flex w-full items-center justify-between">
      <label className="block">
        <input
          name={name}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id={`${name}-input`}
        />
        <div className="flex cursor-pointer border border-dark-300 bg-white px-6 py-3 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:font-light placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          {fileLabel()}
        </div>
      </label>

      <div className="relative flex items-center gap-3">
        <div
          className={`flex flex-col justify-center overflow-hidden ${
            files.length === 0 ? "h-auto" : "h-[60px]"
          }`}
          style={{ maxWidth: "350px" }}
        >
          <span>{files.length} шт.</span>
          {files.length > 0 && (
            <span className="text-xs text-gray-500">{totalSizeMB} МБ</span>
          )}
        </div>

        {files.length > 0 && (
          <button
            type="button"
            onClick={() => setFiles([])}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
          >
            Удалить все
          </button>
        )}
      </div>
    </div>
  );
};

export const FinalStep = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const router = useRouter();
  const [totalSizeMB, setTotalSizeMB] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window !== "undefined" && window.ym) {
      window.ym(YandexMetrikaId, "reachGoal", `promo/quiz/final`);
    }
    setShakeTrigger((prev) => prev + 1);
    // Отправляем данные даже если валидация не прошла
    const uploadedData = {
      name: name.trim(),
      files,
    };

    if (!phone.trim() || !name.trim()) {
      setError("Заполните, пожалуйста, все поля");
      return;
    }
    if (!phone.trim().startsWith("7") || phone.trim().length !== 11) {
      setError("Неверный формат телефона");
      return;
    }
    if (!isAccepted) {
      setError("Необходимо согласиться с условиями");
      return;
    }
    if (totalSizeMB > 50) {
      setError("Максимально допустимо 50 МБ");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const formDataFull = {
        phone: phone.trim(),
        name: name.trim(),
        width: window.screen.width * window.devicePixelRatio,
        height: window.screen.height * window.devicePixelRatio,
        files,
        uploadUrl: null,

        block: "Квиз",
        isAccepted,
        honeypot,
      };
      const response = await sendToTelegram(formDataFull);

      if (response.success) {
        router.push("/thanks");
      } else {
        setError(response.error || "Произошла ошибка при отправке формы");
      }
    } catch (error) {
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();

    // 1. Проверка на пустые поля
    if (!trimmedPhone || !trimmedName) {
      setError("Заполните, пожалуйста, все поля");
      return;
    }

    // 2. Проверка формата телефона
    if (!trimmedPhone.startsWith("7") || trimmedPhone.length !== 11) {
      setError("Неверный формат телефона");
      return;
    }

    // 3. Проверка чекбокса
    if (!isAccepted) {
      setError("Необходимо принять условия");
      return;
    }

    if (totalSizeMB > 50) {
      setError("Максимально допустимо 50 МБ");
      return;
    }

    // 4. Если всё ок — убираем ошибку
    setError("");
  }, [phone, name, isAccepted, totalSizeMB]);

  return (
    <div className="flex h-full w-full flex-col-reverse justify-between gap-5 bg-white md:grid md:grid-cols-12 md:justify-normal md:gap-0 lg:gap-6">
      <aside className="relative col-span-12 mb-5 block aspect-[5/1] sm:hidden md:mb-0 lg:col-span-6 lg:block lg:aspect-auto">
        <Image
          src="/kitchen.jpg"
          alt="img"
          fill
          className="scale-x-[-1] object-cover"
        />
      </aside>
      <div className="col-span-12 h-full max-h-[380px] md:h-auto md:max-h-max lg:col-span-6">
        <div className="flex h-full flex-col justify-between gap-2 px-0 md:gap-0 md:pt-8 lg:px-14 lg:pb-12 lg:pt-1">
          <div className="flex items-center space-x-2 md:mb-3">
            <svg
              className="h-7 w-7 shrink-0 fill-accent"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path d="M23.7715 19.1843L20.6009 22.3555L18.4577 20.2123C18.3963 20.153 18.314 20.1202 18.2287 20.1209C18.1433 20.1217 18.0617 20.1559 18.0013 20.2163C17.941 20.2766 17.9068 20.3583 17.906 20.4436C17.9053 20.529 17.9381 20.6112 17.9974 20.6726L20.3704 23.0495C20.4315 23.1106 20.5143 23.1449 20.6006 23.1449C20.6869 23.1449 20.7697 23.1106 20.8307 23.0495L24.2318 19.6479C24.2911 19.5865 24.3239 19.5042 24.3231 19.4189C24.3224 19.3335 24.2881 19.2519 24.2278 19.1915C24.1674 19.1312 24.0858 19.0969 24.0004 19.0962C23.9151 19.0955 23.8329 19.1283 23.7715 19.1876V19.1843Z" />
              <path d="M21.1148 15.4049C21.0849 15.4049 21.0562 15.4049 21.0263 15.4049C20.7805 15.4092 20.5352 15.4292 20.2919 15.4648V7.03385C20.2919 7.03385 20.2919 7.02995 20.2919 7.02734C20.2916 7.0079 20.2896 6.98851 20.2861 6.9694V6.96224C20.2823 6.94602 20.2773 6.93013 20.2711 6.91471C20.2691 6.90891 20.2667 6.90325 20.2639 6.89779C20.2581 6.88551 20.2515 6.87356 20.2444 6.86198L20.2353 6.847C20.2246 6.83167 20.2126 6.81729 20.1995 6.80404L14.6656 1.27018C14.6517 1.25719 14.6369 1.24523 14.6213 1.23437L14.607 1.22526C14.5954 1.21812 14.5835 1.2116 14.5712 1.20573L14.5543 1.19857C14.5391 1.1924 14.5234 1.1874 14.5074 1.18359H14.4996C14.4805 1.18003 14.4611 1.17807 14.4417 1.17773H1.49959C1.41326 1.17773 1.33046 1.21203 1.26942 1.27308C1.20837 1.33412 1.17407 1.41692 1.17407 1.50326V26.5C1.17407 26.5863 1.20837 26.6691 1.26942 26.7302C1.33046 26.7912 1.41326 26.8255 1.49959 26.8255H19.9664C20.0428 26.8249 20.1165 26.7975 20.1747 26.748C20.9534 26.8776 21.7505 26.8444 22.5157 26.6503C23.2809 26.4563 23.9976 26.1057 24.6204 25.6207C25.2433 25.1357 25.7588 24.5268 26.1345 23.8325C26.5101 23.1382 26.7377 22.3736 26.8029 21.5869C26.8681 20.8002 26.7695 20.0085 26.5133 19.2618C26.2571 18.5151 25.8488 17.8297 25.3143 17.2488C24.7798 16.6679 24.1306 16.2041 23.4078 15.8867C22.685 15.5694 21.9042 15.4053 21.1148 15.4049ZM14.7568 2.28581L19.1806 6.70833H14.7568V2.28581ZM1.82511 26.1745V1.82552H14.1057V7.03385C14.1057 7.12019 14.14 7.20298 14.2011 7.26403C14.2621 7.32508 14.3449 7.35937 14.4312 7.35937H19.6396V15.5983C19.5907 15.6113 19.5426 15.6257 19.4937 15.64L19.4286 15.6582C19.3557 15.6803 19.2834 15.7044 19.2112 15.7298L19.1591 15.7493C19.1044 15.7695 19.0504 15.7891 18.997 15.8105L18.9169 15.8444C18.8733 15.8626 18.8297 15.8809 18.7867 15.9004L18.7001 15.9408L18.5797 15.998L18.4905 16.0436C18.4527 16.0638 18.4143 16.0833 18.3765 16.1042L18.2874 16.1543L18.178 16.2194C18.148 16.237 18.1187 16.2552 18.0894 16.2734C18.0601 16.2917 18.0185 16.3184 17.9833 16.3418L17.8967 16.3991L17.7932 16.4714C17.7652 16.4915 17.7372 16.5117 17.7099 16.5326C17.6825 16.5534 17.6448 16.5833 17.609 16.6094C17.5732 16.6354 17.5543 16.651 17.5276 16.6745C17.5009 16.6979 17.4625 16.7285 17.4286 16.7565L17.3518 16.8216L17.2548 16.9076C17.2307 16.9297 17.2066 16.9512 17.1825 16.9727L17.0842 17.069C17.0621 17.0911 17.04 17.112 17.0191 17.1341C16.9833 17.1712 16.9488 17.2083 16.9143 17.2461C16.8967 17.265 16.8785 17.2832 16.8616 17.3027C16.8101 17.36 16.76 17.418 16.7105 17.4772C15.8856 18.4777 15.4248 19.7288 15.4039 21.0254V21.1139C15.4047 22.4281 15.8578 23.7019 16.6871 24.7214C16.7437 24.791 16.8023 24.8587 16.8622 24.9251C16.8811 24.9466 16.9013 24.9674 16.9208 24.9902C16.9625 25.0352 17.0048 25.0801 17.0471 25.1237L17.1181 25.1934C17.1591 25.2337 17.2014 25.2734 17.2437 25.3132L17.3167 25.3783C17.3629 25.4193 17.4097 25.459 17.4573 25.4987L17.5224 25.5521C17.592 25.6081 17.6617 25.6628 17.7333 25.7148L17.7496 25.7266C17.8147 25.7747 17.8837 25.8223 17.9521 25.8678L18.0256 25.9147C18.0764 25.9473 18.1272 25.9798 18.1793 26.0111L18.2639 26.0605C18.314 26.0898 18.3648 26.1178 18.4163 26.1452C18.4332 26.1543 18.4501 26.1647 18.4677 26.1738L1.82511 26.1745ZM21.1148 26.1745C20.4503 26.1749 19.7922 26.0443 19.1782 25.7902C18.5642 25.5361 18.0063 25.1635 17.5364 24.6936C17.0666 24.2237 16.6939 23.6658 16.4398 23.0518C16.1857 22.4378 16.0552 21.7797 16.0556 21.1152C16.0556 21.0938 16.0556 21.0736 16.0556 21.0501C16.0559 21.0464 16.0559 21.0427 16.0556 21.0391C16.0679 19.8964 16.4685 18.792 17.1917 17.9072C17.9148 17.0225 18.9174 16.41 20.0348 16.1706C20.3649 16.0984 20.7014 16.0597 21.0393 16.0553H21.1135C22.4553 16.0553 23.7422 16.5884 24.691 17.5372C25.6397 18.4859 26.1728 19.7728 26.1728 21.1146C26.1728 22.4564 25.6397 23.7432 24.691 24.692C23.7422 25.6408 22.4553 26.1738 21.1135 26.1738L21.1148 26.1745Z" />
              <path d="M4.58602 10.6281H16.4851C16.5714 10.6281 16.6542 10.5938 16.7153 10.5327C16.7763 10.4717 16.8106 10.3889 16.8106 10.3026C16.8106 10.2162 16.7763 10.1334 16.7153 10.0724C16.6542 10.0113 16.5714 9.97705 16.4851 9.97705H4.58602C4.49969 9.97705 4.41689 10.0113 4.35584 10.0724C4.29479 10.1334 4.2605 10.2162 4.2605 10.3026C4.2605 10.3889 4.29479 10.4717 4.35584 10.5327C4.41689 10.5938 4.49969 10.6281 4.58602 10.6281Z" />
              <path d="M4.58602 14.3254H16.4851C16.5714 14.3254 16.6542 14.2911 16.7153 14.23C16.7763 14.169 16.8106 14.0862 16.8106 13.9998C16.8106 13.9135 16.7763 13.8307 16.7153 13.7697C16.6542 13.7086 16.5714 13.6743 16.4851 13.6743H4.58602C4.49969 13.6743 4.41689 13.7086 4.35584 13.7697C4.29479 13.8307 4.2605 13.9135 4.2605 13.9998C4.2605 14.0862 4.29479 14.169 4.35584 14.23C4.41689 14.2911 4.49969 14.3254 4.58602 14.3254Z" />
              <path d="M13.6355 17.3716H4.58602C4.49969 17.3716 4.41689 17.4059 4.35584 17.4669C4.29479 17.528 4.2605 17.6108 4.2605 17.6971C4.2605 17.7834 4.29479 17.8662 4.35584 17.9273C4.41689 17.9883 4.49969 18.0226 4.58602 18.0226H13.6355C13.7218 18.0226 13.8046 17.9883 13.8657 17.9273C13.9267 17.8662 13.961 17.7834 13.961 17.6971C13.961 17.6108 13.9267 17.528 13.8657 17.4669C13.8046 17.4059 13.7218 17.3716 13.6355 17.3716Z" />
              <path d="M13.6355 21.0684H4.58602C4.49969 21.0684 4.41689 21.1027 4.35584 21.1637C4.29479 21.2247 4.2605 21.3075 4.2605 21.3939C4.2605 21.4802 4.29479 21.563 4.35584 21.6241C4.41689 21.6851 4.49969 21.7194 4.58602 21.7194H13.6355C13.7218 21.7194 13.8046 21.6851 13.8657 21.6241C13.9267 21.563 13.961 21.4802 13.961 21.3939C13.961 21.3075 13.9267 21.2247 13.8657 21.1637C13.8046 21.1027 13.7218 21.0684 13.6355 21.0684Z" />
            </svg>

            <span>
              <b>Благодарим вас за ответы</b>
            </span>
          </div>
          <p className="text-sm md:mb-6 md:text-base xl:text-2xl">
            Оставьте, пожалуйста, Ваши контактные данные, и, если есть,
            прикрепите проект или эскизы будущей мебели, и мы подготовим для Вас{" "}
            <span className="font-bold">
              индивидуальное предложение и расчёт стоимости
            </span>{" "}
          </p>
          <form
            className="space-y-3 pt-0 md:pt-0"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="text"
              name="username_confirm"
              style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
            <PhoneInput
              name="phone"
              value={phone}
              placeholder="+7 (___) ___-__-__"
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              required
            />
            <Input
              name="name"
              type="text"
              value={name}
              placeholder="Ваше имя"
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              required
            />
            <FileUpload
              name="photos"
              required
              files={files}
              setFiles={setFiles}
              setTotalSizeMB={setTotalSizeMB}
            />
            <Button
              disabled={isLoading}
              type="button"
              variant="accent"
              className="relative w-full text-[16px] uppercase"
              onClick={handleSubmit}
            >
              {/*   */}
              {uploadProgress > 0 && (
                <div className="absolute top-[-16px] flex w-full items-center gap-2 space-x-2 pt-1 md:pt-0">
                  <div className="relative h-1 w-full rounded-full bg-gray-300">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">{uploadProgress}%</p>
                </div>
              )}
              {isLoading ? "Отправляем..." : "Получить предложение"}
            </Button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${error ? "max-h-20 opacity-100" : "max-h-20 opacity-0"} `}
            >
              <p
                key={`${error}-${shakeTrigger}`} // меняется и при изменении текста, и при клике
                className={`text-sm text-red-500 ${error ? styles.animateShake : ""}`}
              >
                {error}
              </p>
            </div>
            {/* {success && (
              <p className="text-sm text-green-500">
                Форма успешно отправлена!
              </p>
            )} */}
            <div className="flex items-center gap-2 space-x-2 pt-1 md:pt-0">
              <Checkbox
                id="terms"
                checked={isAccepted}
                onCheckedChange={() => setIsAccepted((prev) => !prev)}
                required
              />
              <label
                htmlFor="terms"
                className="leading-1 text-xs text-gray-400 md:leading-none"
              >
                Я&nbsp;ознакомлен с&nbsp;политикой в&nbsp;отношении обработки
                персональных данных и&nbsp;даю согласие на&nbsp;обработку
                персональных данных.
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
