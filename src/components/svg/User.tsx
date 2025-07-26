import React from "react";

export default function User({ color = "", width = "", height = "" }) {
  return (
    <svg
      width={width ? width : "40"}
      height={height ? height : "40"}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="classname"
    >
      <path
        d="M19.9997 16.6666C23.6816 16.6666 26.6663 13.6819 26.6663 9.99998C26.6663 6.31808 23.6816 3.33331 19.9997 3.33331C16.3178 3.33331 13.333 6.31808 13.333 9.99998C13.333 13.6819 16.3178 16.6666 19.9997 16.6666Z"
        fill={color}
      />
      <path
        d="M33.3337 29.1667C33.3337 33.3084 33.3337 36.6667 20.0003 36.6667C6.66699 36.6667 6.66699 33.3084 6.66699 29.1667C6.66699 25.025 12.637 21.6667 20.0003 21.6667C27.3637 21.6667 33.3337 25.025 33.3337 29.1667Z"
        fill={color}
      />
    </svg>
  );
}
