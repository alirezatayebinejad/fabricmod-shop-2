import { Tooltip } from "@heroui/tooltip";

type Props = {
  children: React.ReactNode;
  content?: string | React.ReactNode;
};
export default function TooltipCustom({ children, content }: Props) {
  return (
    <Tooltip
      placement="top"
      content={content}
      showArrow={true}
      classNames={{
        content: [
          "py-2 px-4 shadow-xl max-w-[350px] break-all",
          "text-TextLow bg-boxBg400",
        ],
        base: ["before:bg-boxBg400 before:border-1"],
      }}
    >
      {children}
    </Tooltip>
  );
}
