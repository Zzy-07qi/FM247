import "./Input.css";

export type InputSize = "sm" | "md" | "lg";
export type InputType = "text" | "password" | "email" | "number" | "search";

export interface InputProps {
  size?: InputSize;
  type?: InputType;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const MyInput = ({
  size = "md",
  type = "text",
  placeholder,
  value,
  defaultValue,
  disabled = false,
  prefix,
  suffix,
  onChange,
  onFocus,
  onBlur,
}: InputProps) => {
  return (
    <div
      className={`input-wrapper input-${size} ${disabled ? "input-disabled" : ""}`}
    >
      {prefix && <span className="input-prefix">{prefix}</span>}
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {suffix && <span className="input-suffix">{suffix}</span>}
    </div>
  );
};
