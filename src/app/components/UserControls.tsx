import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

type UserControlsProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  user: { name: string } | null;
  handleLogin: () => void;
  handleLogout: () => void;
};

const UserControls: React.FC<UserControlsProps> = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  user,
  handleLogin,
  handleLogout,
}) => {
  const { t } = useTranslation();

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value); // Add this line to change the language
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <button
        onClick={handleToggleDarkMode}
        className="bg-purple-500 text-white p-2 rounded-md"
      >
        {darkMode ? t("Light Mode") : t("Dark Mode")}
      </button>
      <select
        value={language}
        onChange={handleLanguageChange}
        className="border p-2 rounded-md text-black"
      >
        <option value="en">English</option>
        <option value="ko">한국어</option>
      </select>
      {user ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-md"
        >
          {t("Logout")}
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white p-2 rounded-md"
        >
          {t("Login")}
        </button>
      )}
    </div>
  );
};

export default UserControls;
