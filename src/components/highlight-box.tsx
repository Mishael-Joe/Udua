export const HighlightBox = ({
  title,
  color = "blue",
  children,
}: {
  title: string;
  color?: "blue" | "yellow" | "green" | "red";
  children: React.ReactNode;
}) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200",
  };

  return (
    <div className={`${colors[color]} p-6 rounded-lg border-l-4 mb-6`}>
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
};
