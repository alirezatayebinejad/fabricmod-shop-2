import StarIcon from "@/components/svg/StarIcon";

type Props = {
  rate: number | string;
  maxRate: number;
  width?: number;
  height?: number;
};

export default function GenerateStarIcons({
  rate,
  maxRate,
  width = 22,
  height = 22,
}: Props) {
  function generateStars(rate: number | string, maxRate: number) {
    const parsedRate = typeof rate === "string" ? parseFloat(rate) : rate;
    const normalizedRate = (parsedRate / maxRate) * 5;

    const fullStars = Math.floor(normalizedRate);
    const halfStar = normalizedRate % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon
          key={`full-${i}`}
          type="full"
          width={width}
          height={height}
        />,
      );
    }

    if (halfStar) {
      stars.push(
        <StarIcon key="half" type="half" width={width} height={height} />,
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon
          key={`empty-${i}`}
          type="empty"
          width={width}
          height={height}
        />,
      );
    }

    return stars;
  }

  return <div className="flex">{generateStars(rate, maxRate)}</div>;
}
