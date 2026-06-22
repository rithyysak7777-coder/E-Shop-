import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { isDarkGold, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDarkGold ? "Switch to white blue mode" : "Switch to black golden mode"}
      aria-label="Toggle store theme"
    >
      <i className={`bi ${isDarkGold ? "bi-moon-stars-fill" : "bi-sun-fill"}`} />
      <span>{isDarkGold ? "Gold" : "Blue"}</span>
    </button>
  );
};

export default ThemeToggle;
