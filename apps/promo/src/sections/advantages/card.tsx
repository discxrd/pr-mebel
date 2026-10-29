export type CardProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  icon: React.ReactNode;
  number: string;
};

export const Card = ({ title, description, icon, number }: CardProps) => (
  <div className="h-[310px] bg-white px-5 pb-5 pt-4 max-md:min-w-[350px] md:col-span-3 md:h-auto">
    <div className="mb-5 flex items-start justify-between">
      <div className="h-10 w-10">{icon}</div>
      <div className="text-2xl text-dark-300">{number}</div>
    </div>
    <h4 className="mb-4 text-xl">{title}</h4>
    <hr className="mb-6 w-full bg-dark-300" />
    <p>{description}</p>
  </div>
);
