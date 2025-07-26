type Props = {
  name: string;
  info: string;
};

export default function InfoCard({ name, info }: Props) {
  return (
    <div className="border-border200 relative flex h-[96px] w-full items-center justify-center rounded-[8px] border-1 bg-accent-3 px-[9px] py-[12px] text-accent-3-foreground max-md:h-[120px] max-md:items-end">
      <h4 className="absolute right-2 top-2 text-TextSize500 font-[500] text-TextLow">
        {name}
      </h4>
      <p className="text-TextSize700 font-[500] text-TextLow">{info}</p>
    </div>
  );
}
