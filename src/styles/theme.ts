import { Theme } from "@/types/apiTypes";

export const generateTheme = (theme: Theme) => {
  const themeCSS = `
  :root {
    --TextSize100: 8px;
    --TextSize200: 10px;
    --TextSize300: 12px;
    --TextSize400: 14px;
    --TextSize500: 16px;
    --TextSize600: 18px;
    --TextSize700: 20px;
  }
  .light {
    --primary: ${theme?.light?.primary || "#e6a200"};
    --primary-foreground: ${theme?.light?.primaryForeground || "#ffffff"};
    --primary-50: ${theme?.light?.primary50 || "#e6a2001a"};
    --primary-100: ${theme?.light?.primary100 || "#e6a2003d"};
    --primary-200: ${theme?.light?.primary200 || "#e6a20063"};
    --secondary: ${theme?.light?.secondary || "#3d4b56"};
    --secondary-foreground: ${theme?.light?.secondaryForeground || "#ffffff"};
    --destructive: ${theme?.light?.destructive || "#df747459"};
    --destructive-foreground: ${theme?.light?.destructiveForeground || "#e25c5c"};
    --border: ${theme?.light?.border || "#e9e9e9"};
    --border2: ${theme?.light?.border2 || "#0000002c"};
    --bodyBg: ${theme?.light?.bodyBg || "#ffffff"};
    --mainBg: ${theme?.light?.mainBg || "#fbfbfb"};
    --success: ${theme?.light?.success || "#b7ffcba1"};
    --success-foreground: ${theme?.light?.successForeground || "#03501cf5"};
    --failure: ${theme?.light?.failure || "#ff37373d"};
    --link: ${theme?.light?.link || "#70a4f3"};
    --lightLink: ${theme?.light?.lightLink || "#c6e4ff66"};
    --boxBg100: ${theme?.light?.boxBg100 || "#ffffff"};
    --boxBg200: ${theme?.light?.boxBg200 || "#fbfbfb"};
    --boxBg250: ${theme?.light?.boxBg250 || "#f6f6f6"};
    --boxBg300: ${theme?.light?.boxBg300 || "#efefef"};
    --boxBg400: ${theme?.light?.boxBg400 || "#eaeaea"};
    --boxBg500: ${theme?.light?.boxBg500 || "#d6d6d6"};
    --TextColor: ${theme?.light?.TextColor || "#191818"};
    --TextLow: ${theme?.light?.TextLow || "#535353"};
    --TextMute: ${theme?.light?.TextMute || "#abadad"};
    --TextReverse: ${theme?.light?.TextReverse || "#eeeeee"};
    --accentColor1: ${theme?.light?.accentColor1 || "#b6ae65"};
    --accentColor1-foreground: ${theme?.light?.accentColor1Foreground || "#ffffff"};
    --accentColor2: ${theme?.light?.accentColor2 || "#1e667cb0"};
    --accentColor2-foreground: ${theme?.light?.accentColor2Foreground || "#ffffff"};
    --accentColor3: ${theme?.light?.accentColor3 || "#f5f5dd"};
    --accentColor3-foreground: ${theme?.light?.accentColor3Foreground || "#191818"};
    --accentColor4: ${theme?.light?.accentColor4 || "#d1eaf1"};
    --accentColor4-foreground: ${theme?.light?.accentColor4Foreground || "#191818"};
  }
  .dark {
    --primary: ${theme?.dark?.primary || "#e6a200"};
    --primary-foreground: ${theme?.dark?.primaryForeground || "#ffffff"};
    --primary-50: ${theme?.dark?.primary50 || "#e6a2001a"};
    --primary-100: ${theme?.dark?.primary100 || "#e6a2003d"};
    --primary-200: ${theme?.dark?.primary200 || "#e6a20063"};
    --secondary: ${theme?.dark?.secondary || "#3d4b56"};
    --secondary-foreground: ${theme?.dark?.secondaryForeground || "#ffffff"};
    --destructive: ${theme?.dark?.destructive || "#df747459"};
    --destructive-foreground: ${theme?.dark?.destructiveForeground || "#e25c5c"};
    --border: ${theme?.dark?.border || "#ffffff13"};
    --border2: ${theme?.dark?.border2 || "#ffffff21"};
    --bodyBg: ${theme?.dark?.bodyBg || "#363631"};
    --mainBg: ${theme?.dark?.mainBg || "#222222"};
    --success: ${theme?.dark?.success || "#b7ffcba1"};
    --success-foreground: ${theme?.dark?.successForeground || "#03501cf5"};
    --failure: ${theme?.dark?.failure || "#ff37373d"};
    --link: ${theme?.dark?.link || "#70a4f3"};
    --lightLink: ${theme?.dark?.lightLink || "#c6e4ff66"};
    --boxBg100: ${theme?.dark?.boxBg100 || "#1a1a1a"};
    --boxBg200: ${theme?.dark?.boxBg200 || "#202020"};
    --boxBg250: ${theme?.dark?.boxBg250 || "#303030"};
    --boxBg300: ${theme?.dark?.boxBg300 || "#3a3a3a"};
    --boxBg400: ${theme?.dark?.boxBg400 || "#3d3d3d"};
    --boxBg500: ${theme?.dark?.boxBg500 || "#666666"};
    --TextColor: ${theme?.dark?.TextColor || "#dee2e2"};
    --TextLow: ${theme?.dark?.TextLow || "#535353"};
    --TextMute: ${theme?.dark?.TextMute || "#8b8b8b"};
    --TextReverse: ${theme?.dark?.TextReverse || "#3f3e3e"};
    --accentColor1: ${theme?.dark?.accentColor1 || "#b6ae65"};
    --accentColor1-foreground: ${theme?.dark?.accentColor1Foreground || "#ffffff"};
    --accentColor2: ${theme?.dark?.accentColor2 || "#1e667c"};
    --accentColor2-foreground: ${theme?.dark?.accentColor2Foreground || "#ffffff"};
    --accentColor3: ${theme?.dark?.accentColor3 || "#f5f5dd"};
    --accentColor3-foreground: ${theme?.dark?.accentColor3Foreground || "#191818"};
    --accentColor4: ${theme?.dark?.accentColor4 || "#d1eaf1"};
    --accentColor4-foreground: ${theme?.dark?.accentColor4Foreground || "#191818"};
  }
`;

  return themeCSS;
};
