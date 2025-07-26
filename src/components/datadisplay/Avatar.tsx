import User from "@/components/svg/User";
import { cn } from "@/utils/twMerge";
import Image from "next/image";

type props = {
  className?: string;
  imgSrc: string | null;
  width?: number;
  height?: number;
  styles?: {
    container?: string;
    icon?: {
      width?: string;
      height?: string;
      color?: string;
    };
    image?: string;
  };
};

export default function Avatar({
  className,
  imgSrc,
  width,
  height,
  styles = {
    icon: {
      color: "#00000020",
    },
  },
}: props) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-boxBg400",
        className,
        styles?.container,
      )}
      style={
        width && height
          ? { width: `${width}px`, height: `${height}px`, overflow: "hidden" }
          : { width: "50px", height: "50px", overflow: "hidden" }
      }
    >
      {imgSrc ? (
        width && height ? (
          <Image
            src={imgSrc}
            alt="profile image"
            width={width}
            height={height}
            className={cn("h-full w-full object-cover", styles?.image)}
          />
        ) : (
          <Image
            src={imgSrc}
            alt="profile image"
            fill
            className={cn(styles?.icon)}
          />
        )
      ) : (
        <User
          color={styles?.icon?.color}
          height={styles?.icon?.height}
          width={styles?.icon?.width}
        />
      )}
    </div>
  );
}
