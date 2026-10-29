/* eslint-disable @next/next/no-img-element */
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { YandexMetrika, YandexMetrikaId, MarquizInit, MarquizWidget, RoistatMetrika } from "@/scripts";
import { CookieConsent } from "@/components/cookie-consent";
import { Preloader } from "@/components/preloader";
import { SmoothScroll } from "@/components/smooth-scroll";

const fonts = localFont({
  src: [
    // {
    //   path: "./fonts/Gilroy/Gilroy-Light.woff",
    //   weight: "300",
    //   style: "normal",
    // },
    {
      path: "./fonts/Involve/Involve-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Involve/Involve-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Involve/Involve-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: {
      index: true,
      follow: true,
    },
    keywords: [
      "Встраиваемая мебель на заказ",
      "Встроенная мебель на заказ Москва",
      "Дизайнерская мебель на заказ",
      "Дизайнерские кухни премиум класса на заказ",
      "Изготовление дизайнерской мебели на заказ",
      "изготовление мебели по дизайн-проекту",
      "изготовление мебели под ключ в Москве",
      "Изготовление мебели премиум класса на заказ в Москве",
      "Индивидуальная мебель на заказ",
      "Мебель из шпона на заказ",
      "Мебель по дизайн проектам на заказ",
      "Мебель по индивидуальным проектам на заказ",
      "Мебель премиум класса на заказ",
      "Производство эксклюзивной мебели на заказ",
      "Шкафы и гардеробные премиум класса на заказ"
    ],
    other: {
      "yandex-verification": "43628ea8b83a7a4c",
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
    metadataBase: new URL("https://nobielemebel.ru"),
    title:
      "Изготовление мебели премиум класса на заказ по индивидуальным размерам",
    description:
      "Кухни, шкафы и гардеробные премиум класса по индивидуальным проектам на заказ от производителя. Изготовление эксклюзивной корпусной мебели по дизайн-проектам.",
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: "https://nobielemebel.ru/",
      title:
        "Изготовление мебели премиум класса на заказ по индивидуальным размерам",
      description:
        "Кухни, шкафы и гардеробные премиум класса по индивидуальным проектам на заказ от производителя. Изготовление эксклюзивной корпусной мебели по дизайн-проектам.",
      images: [
        {
          url: "https://nobielemebel.ru/hero_img.png",
          width: 1200,
          height: 630,
          alt: "Изготовление мебели премиум класса на заказ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Изготовление мебели премиум класса на заказ по индивидуальным размерам",
      description:
        "Кухни, шкафы и гардеробные премиум класса по индивидуальным проектам на заказ от производителя.",
      images: ["https://nobielemebel.ru/hero_img.png"],
    },
    alternates: {
      canonical: "https://nobielemebel.ru/",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${fonts.className} text-dark-900`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Александр3515",
              "description": "кухни на заказ в Москве",
              "url": "https://nobielemebel.ru/",
              "areaServed": "RU",
            }),
          }}
        />
        <Preloader />
        <SmoothScroll />

        {children}
        <CookieConsent />

        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              id="yandex-metrika"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: YandexMetrika,
              }}
            />



            <noscript>
              <div style={{ position: "absolute", left: "-9999px" }}>
                <img src={`https://mc.yandex.ru/watch/${YandexMetrikaId}`} alt="" />
              </div>
            </noscript>

            {/* Marquiz — основной скрипт (head) */}
            <Script
              id="marquiz-init"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{ __html: MarquizInit }}
            />

            {/* Marquiz — виджет (перед </body>) */}
            <Script
              id="marquiz-widget"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{ __html: MarquizWidget }}
            />

            {/* Step-in-Context (Anti-Fraud) */}
            <Script
              src="https://dashboard.step-in-context.ru/static/af.js"
              data-c="110083011"
              strategy="afterInteractive"
            />

            {/* Roistat Metrika */}
            <Script
              id="roistat-metrika"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{ __html: RoistatMetrika }}
            />
          </>
        )}
      </body>

    </html>
  );
}
