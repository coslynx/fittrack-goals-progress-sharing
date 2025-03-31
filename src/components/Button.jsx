```jsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  if (process.env.NODE_ENV === 'development') {
    if (onClick && typeof onClick !== 'function') {
      console.warn("Button: onClick prop should be a function.");
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }
  };

  const baseClasses = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed";
  const disabledClasses = disabled ? " opacity-50 cursor-not-allowed" : "";
  const escapedClassName = className ? className : "";

  return (
    <button
      {...props}
      className={`${baseClasses} ${escapedClassName}${disabledClasses}`}
      onClick={handleClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```