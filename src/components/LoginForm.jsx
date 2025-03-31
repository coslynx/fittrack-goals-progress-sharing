```jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Input from './Input';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps extends React.HTMLAttributes<HTMLFormElement> {}

interface LoginFormState {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
       navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error}
        required
      />
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;
```