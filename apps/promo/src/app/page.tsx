
import { ContactsSection } from "@/sections/contacts";
import { ExamplesSection } from "@/sections/examples";
import { Footer } from "@/sections/footer";
import { Header } from "@/sections/header";
import { Hero } from "@/sections/hero";

import About from "@/sections/about";
import Company from "@/sections/company";
import FormWithFile from "@/sections/formDefault";
import Catalog from "@/sections/catalog";
import FinishingTechnologies from "@/sections/finishing_technologies";

import WhyAreWe from "@/sections/why-are-we";
import OrganizationProcess from "@/sections/organization-process";
import Productions from "@/sections/productions";
import Recaminations from "@/sections/reviews";
import QA from "@/sections/qa";
import FormBottom from "@/sections/form-bottom";
import BgBottom from "@/sections/bg-bottom";

import hero_img from "../../public/hero_img.png";
import hero_img_mobile from "../../public/hero_bg_mobile_v2.png";  
// import hero_img_mobile from "../../public/hero_bg_mini_mob.png";  

import bgImage from "@/../public/forms/bg-form.webp";
import bgImage2 from "@/../public/forms/bg-from-2.webp";
import bgImage2Mini from "@/../public/forms/bg-from-2-mini.webp";

import { accordionItems, whyWeData } from "@/variables";


export default async function Home() {
  return (
    <main>
      <Header />
      {/* <div className="h-[80px]"></div> */}
      <Hero
        type="main"
        image={hero_img}
        imageMobile={hero_img_mobile}
      />

      <About
        type="main"
        text='Мы создаём мебель, которая становится естественным отражением вашего уникального стиля, превращая индивидуальные эскизы в объекты, наполняющие интерьер атмосферой гармонии и уюта.'
      />

      <ExamplesSection title="Наши проекты" />
      <Company />
      <FormWithFile
        title="УЖЕ ЕСТЬ СВОЙ ДИЗАЙН-ПРОЕКТ или эскиз?"
        type="main"
        subtitle="Отправьте его нам, и мы подготовим для Вас персональное предложение"
        file={true}
        bgImage={bgImage}
        btnText="получить предложение"
      />
      <Catalog />
      <FinishingTechnologies />

      <FormWithFile
        title="Хотите разработать дизайн-проект мебели для вашего интерьера?"
        type="develop"
        subtitle="Наши дизайнеры свяжутся с вами и ответят на все вопросы."
        file={false}
        bgImage={bgImage2}
        bgImageMobile={bgImage2Mini}
        btnText="разработать проект"
      />
      <WhyAreWe
        type='main'
        title='Почему выбирают нас'
        description='Наша задача — создать пространство, в котором вам всегда будет приятно находиться. Место, где вы почувствуете комфорт, уют и безопасность. Вам не придётся беспокоиться о процессе изготовления мебели — вы можете быть уверены в качестве и результате'
        list={whyWeData}
      />
      <OrganizationProcess />
      <Productions />
      <Recaminations />
      <QA
        items={accordionItems}
        title="Вопрос-ответ"
      />
      <FormBottom />


      <ContactsSection />

      <Footer />
    </main>
  );
}
