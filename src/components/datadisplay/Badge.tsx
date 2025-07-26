import React from "react";

export default function Badge({
  children,
  content,
  size = 19,
  color = "var(--primary)",
  hideZero = false,
}: {
  children: React.ReactNode;
  content?: string;
  size?: number;
  color?: string;
  hideZero?: boolean;
}) {
  return (
    <div className="relative">
      {children}
      {hideZero && content === "0" ? null : (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
          }}
          className="absolute -left-2 -top-2 flex items-center justify-center rounded-full text-TextSize300 text-primary-foreground"
        >
          {content}
        </div>
      )}
    </div>
  );
}
