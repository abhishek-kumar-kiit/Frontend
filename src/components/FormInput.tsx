 import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        {label}
      </label>

      <input
        {...props}
        className={`block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 sm:text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
