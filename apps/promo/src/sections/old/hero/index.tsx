import Image from "next/image";

// import { Link } from "lucide-react";

const AdvantageItem = ({ children }: { children: React.ReactNode }) => (
  <p className="relative flex h-[50px] items-center before:absolute before:-left-3 before:h-full before:w-[1px] before:bg-accent/70 md:w-[250px] md:self-end">
    {children}
  </p>
);

export const Hero = ({
  className,
  title,
  link,
  thesisMobileComponent,
  subtitleTextComponents,
  imageSrc,
  position,
  imagesClassName,
  imageMobileSrc,
}: {
  className?: string;
  title: React.ReactNode;
  link: React.ReactNode;
  thesisMobileComponent?: React.ReactNode;
  subtitleTextComponents?: React.ReactNode;
  imageSrc: any;
  position: string;
  imagesClassName?: string;
  imageMobileSrc: any;
}) => (
  <section className="relative z-10 h-screen w-full overflow-hidden pb-32 lg:aspect-video xl:pb-8">
    <div className={className} />
    <div className="absolute h-full w-full lg:h-full">
      {/* Мобильная версия — только на мобильных */}
      <Image
        src={imageMobileSrc}
        alt="Hero background (mobile)"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
        className={`block md:hidden`}
      />

      {/* Десктопная версия — только на экранах от md и выше */}
      <Image
        src={imageSrc}
        alt="Hero background (desktop)"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 85%" }}
        className={`hidden md:block ${position === "3" ? "scale-x-[-1]" : ""}`}
      />
    </div>
    <div className="container relative z-10 mx-auto flex h-full flex-col justify-end text-white">
      <div className="relative max-w-[730px]">
        {/* 👇 Сначала — тень (под контентом) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-lg"
          style={{
            boxShadow: `
        inset 0 0 100px 100px rgba(0, 0, 0, 0.25),
        0px 0px 70px 47px rgba(0, 0, 0, 0.25)
      `,
          }}
        ></div>

        {/* 👇 Потом — контент (поверх тени) */}
        <div className="relative z-10">
          {title}
          {thesisMobileComponent}
          {subtitleTextComponents}
          {link}
        </div>
      </div>

      {/* <p className="mt-4 text-sm font-light lg:text-base">
        Пройдите тест и&nbsp;получите индивидуальный дизайн-проект{" "}
        <br className="hidden lg:block" />
        и&nbsp;точную стоимость вашей мебели в&nbsp;течение 24&nbsp;часов
        mt-10 flex max-w-[400px] flex-wrap justify-around gap-3
      </p> */}
      <div className="relative mt-12 hidden w-full items-end gap-24 pl-3 md:mt-24 md:flex md:max-w-[650px] md:flex-wrap md:justify-between md:gap-2 xl:max-w-full xl:flex-nowrap 2xl:mt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 left-[20%] z-0 w-[750px] rounded-lg"
          style={{
            boxShadow: `
        inset 0 0 100px 15px rgba(0, 0, 0, 0.25),
        0px 0px 100px 60px rgba(0, 0, 0, 0.25)
      `,
          }}
        ></div>
        <AdvantageItem>
          Изготавливаем мебель <br /> более 25 лет
        </AdvantageItem>
        <AdvantageItem>
          Обустраиваем более 100 <br /> интерьеров в год
        </AdvantageItem>
        <AdvantageItem>
          Реализуем проекты <br /> дизайнеров со 100% точностью
        </AdvantageItem>
        <AdvantageItem>
          Большой и удобный <br /> шоурум с парковкой
        </AdvantageItem>
      </div>
    </div>
  </section>
);
