import { Card } from "./card";
import { getCards } from "./cards";
import { AnimatedTitle } from "@/components/animated-title";
import s from "./examples.module.css";
import r from "./responsive.module.css";
import { cn } from "@/lib/utils";

export const ExamplesSection = async ({ title }: { title: string }) => {
  const cards = await getCards();
  return (
    <section id="projects" className={cn(s.section, r.section)}>
      <div className={cn(s.sectionWrapper, r.sectionWrapper)}>
        <div className={cn(s.container, r.container)}>
          <AnimatedTitle as="h3" className={cn(s.title, r.title)}>{title}</AnimatedTitle>

          <div className={cn(s.cardProjectList, r.cardProjectList)}>
            {cards.map((card, index) => (
              <Card key={index} index={index} {...card} />
            ))}
          </div>
        </div>

        <div className={cn(s.btnMoreProkect, r.btnMoreProkect)}>
          <button>Перейти в каталог</button>
        </div>
      </div>
    </section>
  );
};
