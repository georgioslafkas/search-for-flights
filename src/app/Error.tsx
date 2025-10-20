export const Error = ({
  error,
  className,
}: {
  error: string | null;
  className?: string | undefined;
}) => {
  return error ? (
    <p className={`${className} text-center p-4 mt-6 border-dashed border-2`}>
      {error}
    </p>
  ) : null;
};
