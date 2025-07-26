import React from "react";

type BgCirclesProps = {
  fillColor?: string;
  opacity?: number;
};

const BgCircles: React.FC<BgCirclesProps> = ({
  fillColor = "var(--boxBg300)",
}) => {
  return (
    <svg
      width="154"
      height="154"
      viewBox="0 0 154 154"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {Array.from({ length: 24 }).map((_, i) => (
          <circle
            key={`circle-${i}`}
            cx={5 + (i % 6) * 28}
            cy={5 + Math.floor(i / 6) * 28}
            r="5.01833"
            fill={fillColor}
          />
        ))}
      </g>
    </svg>
  );
};

export default BgCircles;
