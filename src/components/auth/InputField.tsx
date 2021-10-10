import React, { ReactElement } from "react";
import inputFieldStyles from "../../../styles/components/auth/InputField.module.css";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  setValue: Function;
  icon?: ReactElement;
  required?: boolean;
  maxLength?: number;
}

const InputField = ({
  type,
  placeholder,
  value,
  setValue,
  icon,
  maxLength,
  required = false,
}: InputFieldProps) => {
  return (
    <div className={inputFieldStyles.inputField}>
      {icon ? icon : <></>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => {
          if (type === "tel") {
            setValue(
              e.target.value
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*?)\..*/g, "$1")
                .replace(".", "")
            );
          } else {
            setValue(e.target.value);
          }
        }}
        required={required}
      />
    </div>
  );
};

export default InputField;
