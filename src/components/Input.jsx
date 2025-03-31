```jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  onChange,
  ...props
}) => {
  const { sanitizeInput } = useContext(AuthContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(event.target.value);
    
    // Create a new event with the sanitized value
    const sanitizedEvent = {
      ...event,
      target: {
        ...event.target,
        value: sanitizedValue,
      },
    };
    onChange(sanitizedEvent);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        {...props}
        id={id}
        onChange={handleChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default Input;
```