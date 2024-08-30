"use client";
import React, { useState } from "react";
import "./globals.css";
import UserControls from "./components/UserControls";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState<{ name: string } | null>(null);

  const handleLogin = () => {
    setUser({ name: "User" });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <html lang="en">
      <body
        className={darkMode ? "bg-black text-white" : "bg-white text-black"}
      >
        <UserControls
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          setLanguage={setLanguage}
          user={user}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
        {children}
      </body>
    </html>
  );
}
