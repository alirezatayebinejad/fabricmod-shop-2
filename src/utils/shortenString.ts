export default function shortenString(
  str: string | undefined | null,
  maxLength: number,
  position: "before" | "after",
): string {
  if (!str || str.length === 0) return "";

  // Remove HTML tags and unwanted characters
  const plainText = str
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, " "); // Remove HTML entities

  if (plainText.length <= maxLength) {
    return plainText;
  } else {
    return position === "before"
      ? " ... " + plainText.slice(0, maxLength)
      : plainText.slice(0, maxLength) + " ... ";
  }
}
