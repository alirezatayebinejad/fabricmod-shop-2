export const ParseHTML: React.FC<{ htmlContent: string }> = ({
  htmlContent,
}) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className="font-dana"
    />
  );
};
