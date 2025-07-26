import React from "react";

export default function StarIcon({
  type,
  width = 22,
  height = 22,
}: {
  type: "full" | "half" | "empty";
  width?: number;
  height?: number;
}) {
  if (type === "full")
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
          fill="#EBB035"
        />
      </svg>
    );
  else if (type === "half")
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
          fill="#8d8d8d44"
        />
        <path
          d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L8.00001 8.94427L8.00003 6.5L8 5.52786V0Z"
          fill="#EBB035"
        />
      </svg>
    );
  else if (type === "empty")
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
          fill="#8d8d8d44"
        />
      </svg>
    );
}
