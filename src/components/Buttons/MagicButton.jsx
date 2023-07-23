export default function MagicButton({ onClick, label, disabled, className }) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
