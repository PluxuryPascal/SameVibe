import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        {...props}
        className="w-full p-2 border border-gray-300 rounded-tr-xl rounded-bl-xl focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
}
