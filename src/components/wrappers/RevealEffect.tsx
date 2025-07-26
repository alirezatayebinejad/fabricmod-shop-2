"use client";
import { ReactNode } from "react";
import Reveal, { Fade, FadeProps } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const topToBottomAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* this wrapper is needed when we want to use effect for a server component without making it client component */
type Props = {
  children: ReactNode;
  options?: FadeProps;
  mode: "fade" | "customFadeUp" | "topToBottom";
};

export default function RevealEffect({ children, options, mode }: Props) {
  if (mode === "customFadeUp")
    return (
      <Reveal keyframes={customAnimation} {...options}>
        {children}
      </Reveal>
    );
  else if (mode === "fade") return <Fade {...options}>{children}</Fade>;
  else if (mode === "topToBottom")
    return (
      <Reveal keyframes={topToBottomAnimation} {...options}>
        {children}
      </Reveal>
    );
}
