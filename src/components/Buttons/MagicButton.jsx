export default function MagicButton({
  onClick,
  label,
  disabled,
  className,
  isLoading,
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? "Loading" : label}
    </button>
  );
}
