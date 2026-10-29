"use client";
import { Card } from "@/components/card";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { submitForm } from "@/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/phone-input";
import Form from "next/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, FormEvent, MouseEvent } from "react";
import { sendToTelegram } from "@/server/full";
import { useRouter } from "next/navigation";
import { AnimatedTitle } from "@/components/animated-title";
import styles from "./consultation.module.css";

const ListItem = (props: { children: React.ReactNode }) => (
  <li className="flex items-center gap-3">{props.children}</li>
);

const ListItemIcon = (props: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    className="h-8 w-8 shrink-0 stroke-accent"
  >
    {props.children}
  </svg>
);

const ListItemText = (props: { children: React.ReactNode }) => (
  <p className="font-light lg:text-xl">{props.children}</p>
);

const Title = ({ className }: React.ComponentProps<"h2">) => (
  <AnimatedTitle
    as="h2"
    className={cn(
      "mb-2 text-2xl font-medium uppercase md:mb-10 md:max-w-[400px] md:text-3xl",
      className,
    )}
  >
    <b>Получите консультацию дизайнера шоу рума</b>
  </AnimatedTitle>
);

const Subtitle = ({ className }: React.ComponentProps<"h3">) => (
  <h3 className={cn("mb-2 uppercase text-dark-700 md:mb-5", className)}>
    Консультация дизайнера
  </h3>
);

const List = ({ className }: React.ComponentProps<"ul">) => (
  <ul
    className={cn(
      "flex list-inside list-disc flex-col gap-2 leading-4 md:gap-4 md:leading-none",
      className,
    )}
  >
    <ListItem>
      <ListItemIcon>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.0711 14.0251L16.1052 24.5446L9.92883 18.0251L11.6711 16.3745L16.1052 21.055L24.3288 12.3745L26.0711 14.0251Z"
          strokeWidth="0.816"
        />
        <circle cx="18" cy="18" r="17.55" strokeWidth="0.899958" />
      </ListItemIcon>
      <ListItemText>На что обратить внимание при ремонте</ListItemText>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <path
          d="M13.4998 25.3633V24.9542H13.0907C12.4166 24.9542 11.8634 24.401 11.8634 23.727V11.4542C11.8634 10.7802 12.4166 10.227 13.0907 10.227H17.1816V24.9542H14.7271H14.318V25.3633V25.7724H13.4998V25.3633ZM14.7271 15.9542H14.318V16.3633V18.8179V19.227H14.7271H16.3634H16.7725V18.8179V16.3633V15.9542H16.3634H14.7271ZM21.6816 25.3633V24.9542H21.2725H18.818V10.227H22.9089C23.583 10.227 24.1362 10.7802 24.1362 11.4542V23.727C24.1362 24.401 23.583 24.9542 22.9089 24.9542H22.4998V25.3633V25.7724H21.6816V25.3633ZM21.2725 19.227H21.6816V18.8179V16.3633V15.9542H21.2725H19.6362H19.2271V16.3633V18.8179V19.227H19.6362H21.2725Z"
          strokeWidth="0.818182"
        />
        <circle cx="18" cy="18" r="17.55" strokeWidth="0.899958" />
      </ListItemIcon>
      <ListItemText>Как сделать мебель эргономичной</ListItemText>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <path
          d="M11.0455 20.2067V20.6158H11.4546H13.4942V21.0342H11.4546H11.0455V21.4433V23.9245V24.3336H11.4546H13.4942V26.479V26.8881H13.9033H16.9134H17.3225V26.479V24.3336H20.5662H20.9753V23.9245V21.4433V21.0342H20.5662H17.3225V20.6158H20.1838C21.5033 20.6158 22.6525 20.3913 23.6164 19.924L23.6182 19.9231C24.5752 19.4533 25.3204 18.7984 25.8369 17.9554L25.8375 17.9543C26.353 17.107 26.6049 16.134 26.6049 15.0489C26.6049 14 26.355 13.0434 25.8489 12.1895C25.345 11.3247 24.6067 10.647 23.6505 10.1543C22.6834 9.65043 21.5222 9.40878 20.1838 9.40878H13.9033H13.4942V9.81787V17.3163H11.4546H11.0455V17.7254V20.2067ZM20.1187 17.3163H17.3225V12.7326H20.1838C20.8155 12.7326 21.3 12.8467 21.661 13.0473L21.661 13.0473L21.6663 13.0501C22.044 13.2528 22.313 13.5234 22.4892 13.8626L22.4891 13.8626L22.4921 13.8683C22.6781 14.2129 22.7733 14.6097 22.7685 15.069L22.7684 15.069L22.7685 15.0775C22.7733 15.5497 22.6772 15.9405 22.4955 16.2641L22.4955 16.2641L22.4934 16.2679C22.322 16.5806 22.0533 16.8342 21.664 17.0242L21.6622 17.0251C21.2861 17.2109 20.7788 17.3163 20.1187 17.3163Z"
          stroke="#D24A43"
          strokeWidth="0.818182"
        />
        <circle
          cx="18"
          cy="18"
          r="17.55"
          stroke="#D24A43"
          strokeWidth="0.899958"
        />
      </ListItemIcon>
      <ListItemText>Как оптимизировать бюджет без потери качества</ListItemText>
    </ListItem>
  </ul>
);

export const Consultation = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [honeypot, setHoneypot] = useState("");

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

    // 4. Если всё ок — убираем ошибку
    setError("");
  }, [phone, name, isAccepted]);
  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShakeTrigger((prev) => prev + 1);
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
    setIsLoading(true);
    setError("");

    // Отправляем данные даже если валидация не прошла
    const formData = {
      phone: phone.trim(),
      name: name.trim(),
      width: window.screen.width * window.devicePixelRatio,
      height: window.screen.height * window.devicePixelRatio,
      block: "Консультация дизайнера",
      uploadUrl: null,
      isAccepted,
      honeypot,
    };

    try {
      const response = await sendToTelegram(formData);

      if (response.success) {
        // setSuccess(true);
        // setName("");
        // setPhone("");
        // setIsAccepted(false);
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

  return (
    <div className="m-auto w-full bg-white px-5 md:h-auto md:px-0">
      <Section
        id="consultation"
        className="scroll-mt-[60px] bg-white px-0 xl:container md:px-0 md:pl-0 md:pr-0"
      >
        <Subtitle className="md:hidden" />
        <Title className="md:hidden" />
        {/* mobile */}
        <Card className="w-full px-0 md:hidden">
          <div className="relative aspect-video w-full">
            <Image
              src="/consultation-mobile.png"
              alt="consultation"
              fill
              className="object-cover"
            />
          </div>
          <h4 className="mb-1 mt-3 text-xl font-medium md:mb-3 md:mt-6">
            На консультации Вы узнаете:
          </h4>
          <List />
          <Form
            className="grid-cols-2 gap-2 space-y-3 md:mt-6 md:grid"
            action={submitForm}
            onSubmit={handleSubmit}
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
            <input type="hidden" name="formSource" value="consultation-form" />
            <Input
              name="name"
              type="name"
              placeholder="Ваше имя"
              onChange={(e) => setName(e.target.value)}
            />
            <PhoneInput
              name="phone"
              required
              onChange={(e) => setPhone(e.target.value)}
            />
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

            <Button
              type="submit"
              variant="accent"
              // disabled={isAccepted}
              className="w-full"
              onClick={handleSubmit}
            >
              {isLoading ? "Отправляем..." : "Получить предложение"}
            </Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={isAccepted}
                onCheckedChange={(state) => setIsAccepted(state === true)}
              />
              <label
                htmlFor="terms"
                className="text-xs leading-none text-gray-400"
              >
                Я&nbsp;ознакомлен с&nbsp;политикой в&nbsp;отношении обработки
                персональных данных и&nbsp;даю согласие на&nbsp;обработку
                персональных данных.
              </label>
            </div>
          </Form>
        </Card>
        {/* desktop */}
        <Card className="hidden w-full grid-cols-12 gap-10 md:grid">
          <div className="col-span-6">
            <Subtitle />
            <Title />
            <h4 className="mb-6 mt-6 text-xl font-medium">
              На консультации Вы узнаете:
            </h4>
            <List />
            <Form
              className="mt-6 w-full max-w-[500px] grid-cols-2 gap-2 gap-y-3 md:grid"
              action={submitForm}
              onSubmit={handleSubmit}
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
              <input
                type="hidden"
                name="formSource"
                value="consultation-form"
              />
              <Input
                name="name"
                type="name"
                placeholder="Ваше имя"
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                // required
              />
              <PhoneInput
                name="phone"
                // required
                onChange={(e) => setPhone(e.target.value)}
              />
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
              <Button
                type="submit"
                variant="accent"
                className="col-span-2"
                onClick={handleSubmit}

                // disabled={buttonDisabled}
              >
                {isLoading ? "Отправляем..." : "Получить предложение"}
              </Button>

              <div className="col-span-2 flex w-full items-center gap-4">
                <Checkbox
                  id="terms-consultation"
                  checked={isAccepted}
                  // required
                  onCheckedChange={(state) => setIsAccepted(state === true)}
                />
                <label
                  htmlFor="terms-consultation"
                  className="text-xs leading-none text-gray-400"
                >
                  Я ознакомлен с политикой в отношении обработки персональных
                  данных и даю согласие на обработку персональных данных.
                </label>
              </div>
            </Form>
          </div>
          <div className="relative col-span-6 h-full">
            <Image
              src="/consultation.jpg"
              alt="consultation"
              fill
              className="object-cover"
            />
          </div>
        </Card>
      </Section>
    </div>
  );
};
