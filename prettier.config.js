module.exports = {
  tailwindFunctions: ["clsx"],
  tailwindConfig: "./tailwind.config.ts",
  plugins: ["prettier-plugin-tailwindcss"],
};
/* to manualy format all project styles if using yarn:
yarn:
yarn prettier . --write 
npx:
npx prettier . --write
pnpm:
pnpm exec prettier . --write
*/
