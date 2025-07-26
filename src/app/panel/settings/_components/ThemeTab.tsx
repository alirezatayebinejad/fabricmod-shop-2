"use client";
import React from "react";
import ColorInput from "@/components/inputs/ColorInput";
import { Moon, Sun } from "lucide-react";
import useMyForm from "@/hooks/useMyForm";
import apiCRUD from "@/services/apiCRUD";
import { Button } from "@heroui/button";
import { Setting } from "@/types/apiTypes";

export default function ThemeTab({
  theme,
}: {
  theme: Setting["theme_colors"] | undefined;
}) {
  const { values, loading, setValues, handleSubmit, setErrors } = useMyForm(
    {
      theme_colors: {
        light: {
          primary: theme?.light?.primary || "",
          primaryForeground: theme?.light?.primaryForeground || "",
          primary50: theme?.light?.primary50 || "",
          primary100: theme?.light?.primary100 || "",
          primary200: theme?.light?.primary200 || "",
          secondary: theme?.light?.secondary || "",
          secondaryForeground: theme?.light?.secondaryForeground || "",
          destructive: theme?.light?.destructive || "",
          destructiveForeground: theme?.light?.destructiveForeground || "",
          border: theme?.light?.border || "",
          border2: theme?.light?.border2 || "",
          bodyBg: theme?.light?.bodyBg || "",
          mainBg: theme?.light?.mainBg || "",
          success: theme?.light?.success || "",
          successForeground: theme?.light?.successForeground || "",
          failure: theme?.light?.failure || "",
          link: theme?.light?.link || "",
          lightLink: theme?.light?.lightLink || "",
          boxBg100: theme?.light?.boxBg100 || "",
          boxBg200: theme?.light?.boxBg200 || "",
          boxBg250: theme?.light?.boxBg250 || "",
          boxBg300: theme?.light?.boxBg300 || "",
          boxBg400: theme?.light?.boxBg400 || "",
          boxBg500: theme?.light?.boxBg500 || "",
          TextColor: theme?.light?.TextColor || "",
          TextLow: theme?.light?.TextLow || "",
          TextMute: theme?.light?.TextMute || "",
          TextReverse: theme?.light?.TextReverse || "",
          accentColor1: theme?.light?.accentColor1 || "",
          accentColor1Foreground: theme?.light?.accentColor1Foreground || "",
          accentColor2: theme?.light?.accentColor2 || "",
          accentColor2Foreground: theme?.light?.accentColor2Foreground || "",
          accentColor3: theme?.light?.accentColor3 || "",
          accentColor3Foreground: theme?.light?.accentColor3Foreground || "",
          accentColor4: theme?.light?.accentColor4 || "",
          accentColor4Foreground: theme?.light?.accentColor4Foreground || "",
        },
        dark: {
          primary: theme?.dark?.primary || "",
          primaryForeground: theme?.dark?.primaryForeground || "",
          primary50: theme?.dark?.primary50 || "",
          primary100: theme?.dark?.primary100 || "",
          primary200: theme?.dark?.primary200 || "",
          secondary: theme?.dark?.secondary || "",
          secondaryForeground: theme?.dark?.secondaryForeground || "",
          destructive: theme?.dark?.destructive || "",
          destructiveForeground: theme?.dark?.destructiveForeground || "",
          border: theme?.dark?.border || "",
          border2: theme?.dark?.border2 || "",
          bodyBg: theme?.dark?.bodyBg || "",
          mainBg: theme?.dark?.mainBg || "",
          success: theme?.dark?.success || "",
          successForeground: theme?.dark?.successForeground || "",
          failure: theme?.dark?.failure || "",
          link: theme?.dark?.link || "",
          lightLink: theme?.dark?.lightLink || "",
          boxBg100: theme?.dark?.boxBg100 || "",
          boxBg200: theme?.dark?.boxBg200 || "",
          boxBg250: theme?.dark?.boxBg250 || "",
          boxBg300: theme?.dark?.boxBg300 || "",
          boxBg400: theme?.dark?.boxBg400 || "",
          boxBg500: theme?.dark?.boxBg500 || "",
          TextColor: theme?.dark?.TextColor || "",
          TextLow: theme?.dark?.TextLow || "",
          TextMute: theme?.dark?.TextMute || "",
          TextReverse: theme?.dark?.TextReverse || "",
          accentColor1: theme?.dark?.accentColor1 || "",
          accentColor1Foreground: theme?.dark?.accentColor1Foreground || "",
          accentColor2: theme?.dark?.accentColor2 || "",
          accentColor2Foreground: theme?.dark?.accentColor2Foreground || "",
          accentColor3: theme?.dark?.accentColor3 || "",
          accentColor3Foreground: theme?.dark?.accentColor3Foreground || "",
          accentColor4: theme?.dark?.accentColor4 || "",
          accentColor4Foreground: theme?.dark?.accentColor4Foreground || "",
        },
      },
    },
    async (formdata) => {
      const res = await apiCRUD({
        urlSuffix: "admin-panel/settings/theme",
        method: "POST",
        updateCacheByTag: "theme",
        data: { ...formdata },
      });
      if (res?.message) setErrors(res.message);
    },
  );

  const handleColorChange =
    (
      themeType: keyof typeof values.theme_colors,
      colorType: keyof (typeof values.theme_colors)[typeof themeType],
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prevValues) => ({
        ...prevValues,
        theme_colors: {
          ...prevValues.theme_colors,
          [themeType]: {
            ...prevValues.theme_colors[themeType],
            [colorType]: e.target.value,
          },
        },
      }));
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-5 border-3 border-boxBg250 max-sm:grid-cols-2"
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="mb-8 mt-4 flex items-center gap-1">
          <Sun className="w-5 text-TextColor" />
          <h2 className="font-bold">تم لایت</h2>
        </div>
        <ColorInput
          name="light-primary"
          label="Primary (اصلی)"
          value={values.theme_colors.light.primary}
          onChange={handleColorChange("light", "primary")}
        />
        <ColorInput
          name="light-primaryForeground"
          label="Primary Foreground (پیش زمینه اصلی)"
          value={values.theme_colors.light.primaryForeground}
          onChange={handleColorChange("light", "primaryForeground")}
        />
        <ColorInput
          name="light-primary50"
          label="Primary 50 (اصلی 50)"
          value={values.theme_colors.light.primary50}
          onChange={handleColorChange("light", "primary50")}
        />
        <ColorInput
          name="light-primary100"
          label="Primary 100 (اصلی 100)"
          value={values.theme_colors.light.primary100}
          onChange={handleColorChange("light", "primary100")}
        />
        <ColorInput
          name="light-primary200"
          label="Primary 200 (اصلی 200)"
          value={values.theme_colors.light.primary200}
          onChange={handleColorChange("light", "primary200")}
        />
        <ColorInput
          name="light-secondary"
          label="Secondary (ثانویه)"
          value={values.theme_colors.light.secondary}
          onChange={handleColorChange("light", "secondary")}
        />
        <ColorInput
          name="light-secondaryForeground"
          label="Secondary Foreground (پیش زمینه ثانویه)"
          value={values.theme_colors.light.secondaryForeground}
          onChange={handleColorChange("light", "secondaryForeground")}
        />
        <ColorInput
          name="light-destructive"
          label="Destructive (مخرب)"
          value={values.theme_colors.light.destructive}
          onChange={handleColorChange("light", "destructive")}
        />
        <ColorInput
          name="light-destructiveForeground"
          label="Destructive Foreground (پیش زمینه مخرب)"
          value={values.theme_colors.light.destructiveForeground}
          onChange={handleColorChange("light", "destructiveForeground")}
        />
        <ColorInput
          name="light-border"
          label="Border (حاشیه)"
          value={values.theme_colors.light.border}
          onChange={handleColorChange("light", "border")}
        />
        <ColorInput
          name="light-border2"
          label="Border 2 (حاشیه 2)"
          value={values.theme_colors.light.border2}
          onChange={handleColorChange("light", "border2")}
        />
        <ColorInput
          name="light-bodyBg"
          label="Body Background (زمینه بدنه)"
          value={values.theme_colors.light.bodyBg}
          onChange={handleColorChange("light", "bodyBg")}
        />
        <ColorInput
          name="light-mainBg"
          label="Main Background (زمینه اصلی)"
          value={values.theme_colors.light.mainBg}
          onChange={handleColorChange("light", "mainBg")}
        />
        <ColorInput
          name="light-success"
          label="Success (موفقیت)"
          value={values.theme_colors.light.success}
          onChange={handleColorChange("light", "success")}
        />
        <ColorInput
          name="light-successForeground"
          label="Success Foreground (پیش زمینه موفقیت)"
          value={values.theme_colors.light.successForeground}
          onChange={handleColorChange("light", "successForeground")}
        />
        <ColorInput
          name="light-failure"
          label="Failure (شکست)"
          value={values.theme_colors.light.failure}
          onChange={handleColorChange("light", "failure")}
        />
        <ColorInput
          name="light-link"
          label="Link (لینک)"
          value={values.theme_colors.light.link}
          onChange={handleColorChange("light", "link")}
        />
        <ColorInput
          name="light-lightLink"
          label="Light Link (لینک روشن)"
          value={values.theme_colors.light.lightLink}
          onChange={handleColorChange("light", "lightLink")}
        />
        <ColorInput
          name="light-boxBg100"
          label="Box Background 100 (زمینه جعبه 100)"
          value={values.theme_colors.light.boxBg100}
          onChange={handleColorChange("light", "boxBg100")}
        />
        <ColorInput
          name="light-boxBg200"
          label="Box Background 200 (زمینه جعبه 200)"
          value={values.theme_colors.light.boxBg200}
          onChange={handleColorChange("light", "boxBg200")}
        />
        <ColorInput
          name="light-boxBg250"
          label="Box Background 250 (زمینه جعبه 250)"
          value={values.theme_colors.light.boxBg250}
          onChange={handleColorChange("light", "boxBg250")}
        />
        <ColorInput
          name="light-boxBg300"
          label="Box Background 300 (زمینه جعبه 300)"
          value={values.theme_colors.light.boxBg300}
          onChange={handleColorChange("light", "boxBg300")}
        />
        <ColorInput
          name="light-boxBg400"
          label="Box Background 400 (زمینه جعبه 400)"
          value={values.theme_colors.light.boxBg400}
          onChange={handleColorChange("light", "boxBg400")}
        />
        <ColorInput
          name="light-boxBg500"
          label="Box Background 500 (زمینه جعبه 500)"
          value={values.theme_colors.light.boxBg500}
          onChange={handleColorChange("light", "boxBg500")}
        />
        <ColorInput
          name="light-TextColor"
          label="Text Color (رنگ متن)"
          value={values.theme_colors.light.TextColor}
          onChange={handleColorChange("light", "TextColor")}
        />
        <ColorInput
          name="light-TextLow"
          label="Text Low (متن کم‌رنگ)"
          value={values.theme_colors.light.TextLow}
          onChange={handleColorChange("light", "TextLow")}
        />
        <ColorInput
          name="light-TextMute"
          label="Text Mute (متن بی‌صدا)"
          value={values.theme_colors.light.TextMute}
          onChange={handleColorChange("light", "TextMute")}
        />
        <ColorInput
          name="light-TextReverse"
          label="Text Reverse (متن معکوس)"
          value={values.theme_colors.light.TextReverse}
          onChange={handleColorChange("light", "TextReverse")}
        />
        <ColorInput
          name="light-accentColor1"
          label="Accent Color 1 (رنگ تأکیدی 1)"
          value={values.theme_colors.light.accentColor1}
          onChange={handleColorChange("light", "accentColor1")}
        />
        <ColorInput
          name="light-accentColor1Foreground"
          label="Accent Color 1 Foreground (پیش زمینه رنگ تأکیدی 1)"
          value={values.theme_colors.light.accentColor1Foreground}
          onChange={handleColorChange("light", "accentColor1Foreground")}
        />
        <ColorInput
          name="light-accentColor2"
          label="Accent Color 2 (رنگ تأکیدی 2)"
          value={values.theme_colors.light.accentColor2}
          onChange={handleColorChange("light", "accentColor2")}
        />
        <ColorInput
          name="light-accentColor2Foreground"
          label="Accent Color 2 Foreground (پیش زمینه رنگ تأکیدی 2)"
          value={values.theme_colors.light.accentColor2Foreground}
          onChange={handleColorChange("light", "accentColor2Foreground")}
        />
        <ColorInput
          name="light-accentColor3"
          label="Accent Color 3 (رنگ تأکیدی 3)"
          value={values.theme_colors.light.accentColor3}
          onChange={handleColorChange("light", "accentColor3")}
        />
        <ColorInput
          name="light-accentColor3Foreground"
          label="Accent Color 3 Foreground (پیش زمینه رنگ تأکیدی 3)"
          value={values.theme_colors.light.accentColor3Foreground}
          onChange={handleColorChange("light", "accentColor3Foreground")}
        />
        <ColorInput
          name="light-accentColor4"
          label="Accent Color 4 (رنگ تأکیدی 4)"
          value={values.theme_colors.light.accentColor4}
          onChange={handleColorChange("light", "accentColor4")}
        />
        <ColorInput
          name="light-accentColor4Foreground"
          label="Accent Color 4 Foreground (پیش زمینه رنگ تأکیدی 4)"
          value={values.theme_colors.light.accentColor4Foreground}
          onChange={handleColorChange("light", "accentColor4Foreground")}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-5 bg-boxBg250">
        <div className="mb-8 mt-4 flex items-center gap-1 py-2">
          <Moon className="w-5 text-TextColor" />
          <h2 className="font-bold">تم دارک</h2>
        </div>
        <ColorInput
          name="dark-primary"
          label="Primary (اصلی)"
          value={values.theme_colors.dark.primary}
          onChange={handleColorChange("dark", "primary")}
        />
        <ColorInput
          name="dark-primaryForeground"
          label="Primary Foreground (پیش زمینه اصلی)"
          value={values.theme_colors.dark.primaryForeground}
          onChange={handleColorChange("dark", "primaryForeground")}
        />
        <ColorInput
          name="dark-primary50"
          label="Primary 50 (اصلی 50)"
          value={values.theme_colors.dark.primary50}
          onChange={handleColorChange("dark", "primary50")}
        />
        <ColorInput
          name="dark-primary100"
          label="Primary 100 (اصلی 100)"
          value={values.theme_colors.dark.primary100}
          onChange={handleColorChange("dark", "primary100")}
        />
        <ColorInput
          name="dark-primary200"
          label="Primary 200 (اصلی 200)"
          value={values.theme_colors.dark.primary200}
          onChange={handleColorChange("dark", "primary200")}
        />
        <ColorInput
          name="dark-secondary"
          label="Secondary (ثانویه)"
          value={values.theme_colors.dark.secondary}
          onChange={handleColorChange("dark", "secondary")}
        />
        <ColorInput
          name="dark-secondaryForeground"
          label="Secondary Foreground (پیش زمینه ثانویه)"
          value={values.theme_colors.dark.secondaryForeground}
          onChange={handleColorChange("dark", "secondaryForeground")}
        />
        <ColorInput
          name="dark-destructive"
          label="Destructive (مخرب)"
          value={values.theme_colors.dark.destructive}
          onChange={handleColorChange("dark", "destructive")}
        />
        <ColorInput
          name="dark-destructiveForeground"
          label="Destructive Foreground (پیش زمینه مخرب)"
          value={values.theme_colors.dark.destructiveForeground}
          onChange={handleColorChange("dark", "destructiveForeground")}
        />
        <ColorInput
          name="dark-border"
          label="Border (حاشیه)"
          value={values.theme_colors.dark.border}
          onChange={handleColorChange("dark", "border")}
        />
        <ColorInput
          name="dark-border2"
          label="Border 2 (حاشیه 2)"
          value={values.theme_colors.dark.border2}
          onChange={handleColorChange("dark", "border2")}
        />
        <ColorInput
          name="dark-bodyBg"
          label="Body Background (زمینه بدنه)"
          value={values.theme_colors.dark.bodyBg}
          onChange={handleColorChange("dark", "bodyBg")}
        />
        <ColorInput
          name="dark-mainBg"
          label="Main Background (زمینه اصلی)"
          value={values.theme_colors.dark.mainBg}
          onChange={handleColorChange("dark", "mainBg")}
        />
        <ColorInput
          name="dark-success"
          label="Success (موفقیت)"
          value={values.theme_colors.dark.success}
          onChange={handleColorChange("dark", "success")}
        />
        <ColorInput
          name="dark-successForeground"
          label="Success Foreground (پیش زمینه موفقیت)"
          value={values.theme_colors.dark.successForeground}
          onChange={handleColorChange("dark", "successForeground")}
        />
        <ColorInput
          name="dark-failure"
          label="Failure (شکست)"
          value={values.theme_colors.dark.failure}
          onChange={handleColorChange("dark", "failure")}
        />
        <ColorInput
          name="dark-link"
          label="Link (لینک)"
          value={values.theme_colors.dark.link}
          onChange={handleColorChange("dark", "link")}
        />
        <ColorInput
          name="dark-lightLink"
          label="Light Link (لینک روشن)"
          value={values.theme_colors.dark.lightLink}
          onChange={handleColorChange("dark", "lightLink")}
        />
        <ColorInput
          name="dark-boxBg100"
          label="Box Background 100 (زمینه جعبه 100)"
          value={values.theme_colors.dark.boxBg100}
          onChange={handleColorChange("dark", "boxBg100")}
        />
        <ColorInput
          name="dark-boxBg200"
          label="Box Background 200 (زمینه جعبه 200)"
          value={values.theme_colors.dark.boxBg200}
          onChange={handleColorChange("dark", "boxBg200")}
        />
        <ColorInput
          name="dark-boxBg250"
          label="Box Background 250 (زمینه جعبه 250)"
          value={values.theme_colors.dark.boxBg250}
          onChange={handleColorChange("dark", "boxBg250")}
        />
        <ColorInput
          name="dark-boxBg300"
          label="Box Background 300 (زمینه جعبه 300)"
          value={values.theme_colors.dark.boxBg300}
          onChange={handleColorChange("dark", "boxBg300")}
        />
        <ColorInput
          name="dark-boxBg400"
          label="Box Background 400 (زمینه جعبه 400)"
          value={values.theme_colors.dark.boxBg400}
          onChange={handleColorChange("dark", "boxBg400")}
        />
        <ColorInput
          name="dark-boxBg500"
          label="Box Background 500 (زمینه جعبه 500)"
          value={values.theme_colors.dark.boxBg500}
          onChange={handleColorChange("dark", "boxBg500")}
        />
        <ColorInput
          name="dark-TextColor"
          label="Text Color (رنگ متن)"
          value={values.theme_colors.dark.TextColor}
          onChange={handleColorChange("dark", "TextColor")}
        />
        <ColorInput
          name="dark-TextLow"
          label="Text Low (متن کم‌رنگ)"
          value={values.theme_colors.dark.TextLow}
          onChange={handleColorChange("dark", "TextLow")}
        />
        <ColorInput
          name="dark-TextMute"
          label="Text Mute (متن بی‌صدا)"
          value={values.theme_colors.dark.TextMute}
          onChange={handleColorChange("dark", "TextMute")}
        />
        <ColorInput
          name="dark-TextReverse"
          label="Text Reverse (متن معکوس)"
          value={values.theme_colors.dark.TextReverse}
          onChange={handleColorChange("dark", "TextReverse")}
        />
        <ColorInput
          name="dark-accentColor1"
          label="Accent Color 1 (رنگ تأکیدی 1)"
          value={values.theme_colors.dark.accentColor1}
          onChange={handleColorChange("dark", "accentColor1")}
        />
        <ColorInput
          name="dark-accentColor1Foreground"
          label="Accent Color 1 Foreground (پیش زمینه رنگ تأکیدی 1)"
          value={values.theme_colors.dark.accentColor1Foreground}
          onChange={handleColorChange("dark", "accentColor1Foreground")}
        />
        <ColorInput
          name="dark-accentColor2"
          label="Accent Color 2 (رنگ تأکیدی 2)"
          value={values.theme_colors.dark.accentColor2}
          onChange={handleColorChange("dark", "accentColor2")}
        />
        <ColorInput
          name="dark-accentColor2Foreground"
          label="Accent Color 2 Foreground (پیش زمینه رنگ تأکیدی 2)"
          value={values.theme_colors.dark.accentColor2Foreground}
          onChange={handleColorChange("dark", "accentColor2Foreground")}
        />
        <ColorInput
          name="dark-accentColor3"
          label="Accent Color 3 (رنگ تأکیدی 3)"
          value={values.theme_colors.dark.accentColor3}
          onChange={handleColorChange("dark", "accentColor3")}
        />
        <ColorInput
          name="dark-accentColor3Foreground"
          label="Accent Color 3 Foreground (پیش زمینه رنگ تأکیدی 3)"
          value={values.theme_colors.dark.accentColor3Foreground}
          onChange={handleColorChange("dark", "accentColor3Foreground")}
        />
        <ColorInput
          name="dark-accentColor4"
          label="Accent Color 4 (رنگ تأکیدی 4)"
          value={values.theme_colors.dark.accentColor4}
          onChange={handleColorChange("dark", "accentColor4")}
        />
        <ColorInput
          name="dark-accentColor4Foreground"
          label="Accent Color 4 Foreground (پیش زمینه رنگ تأکیدی 4)"
          value={values.theme_colors.dark.accentColor4Foreground}
          onChange={handleColorChange("dark", "accentColor4Foreground")}
        />
      </div>
      <div className="col-span-full my-[20px] flex justify-center">
        <Button
          type="submit"
          isLoading={loading}
          color="primary"
          className="rounded-lg py-[25px] text-primary-foreground"
        >
          ذخیره تغییرات
        </Button>
      </div>
    </form>
  );
}
