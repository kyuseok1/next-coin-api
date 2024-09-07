import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-red-500 text-2xl">{message}</div>
  </div>
);

export default ErrorMessage;
