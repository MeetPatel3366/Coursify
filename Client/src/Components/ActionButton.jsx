import { useSelector } from "react-redux";

const ActionButton=({ label, className, type = "submit" })=> {
  const cooldown = useSelector((state) => state.rateLimit.cooldown);

  return (
    <button
      type={type}
      disabled={cooldown > 0}
      className={`${className} ${cooldown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {cooldown > 0 ? `Wait ${cooldown}s` : label}
    </button>
  );
}

export default ActionButton;


