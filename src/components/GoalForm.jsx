```jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Input from './Input';
import Button from './Button';
import { post, put } from '../services/api';

interface GoalFormProps {
  goal?: {
    id: string;
    name: string;
    description: string;
    targetDate: string;
  };
  onSubmit: () => void;
  onCancel: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onSubmit, onCancel }) => {
  const [name, setName] = useState(goal?.name || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [targetDate, setTargetDate] = useState(goal?.targetDate || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { sanitizeInput } = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const sanitizedName = sanitizeInput(name);
    const sanitizedDescription = sanitizeInput(description);
    const sanitizedTargetDate = sanitizeInput(targetDate);

    if (!sanitizedName) {
      setError('Goal name is required.');
      return;
    }

    if (!sanitizedDescription) {
      setError('Goal description is required.');
      return;
    }

    if (!sanitizedTargetDate) {
      setError('Target date is required.');
      return;
    }

    const targetDateObj = new Date(sanitizedTargetDate);
    if (isNaN(targetDateObj.getTime())) {
      setError('Invalid target date.');
      return;
    }

    if (targetDateObj <= new Date()) {
      setError('Target date must be in the future.');
      return;
    }

    setIsLoading(true);
    try {
      if (goal) {
        // Update existing goal
        await put(`/api/goals/${goal.id}`, {
          name: sanitizedName,
          description: sanitizedDescription,
          targetDate: sanitizedTargetDate,
        });
      } else {
        // Create new goal
        await post('/api/goals', {
          name: sanitizedName,
          description: sanitizedDescription,
          targetDate: sanitizedTargetDate,
        });
      }
      onSubmit(); // Notify parent component
    } catch (err: any) {
      setError(err.message || 'Failed to save goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className=\"max-w-sm mx-auto bg-white p-8 rounded shadow-md\">
      <h2 className=\"text-2xl font-bold mb-6 text-gray-800\">{goal ? 'Edit Goal' : 'Create Goal'}</h2>
      <Input
        id=\"name\"
        label=\"Goal Name\"
        type=\"text\"
        placeholder=\"Enter goal name\"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        required
      />
      <Input
        id=\"description\"
        label=\"Description\"
        type=\"text\"
        placeholder=\"Enter goal description\"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={error}
        required
      />
      <Input
        id=\"targetDate\"
        label=\"Target Date\"
        type=\"date\"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        error={error}
        required
      />
      {error && <p className=\"text-red-500 text-xs italic mb-4\">{error}</p>}
      <div className=\"flex justify-between\">
        <Button type=\"submit\" disabled={isLoading} className=\"w-2/5\">
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        <Button type=\"button\" onClick={onCancel} disabled={isLoading} className=\"w-2/5 bg-gray-300 hover:bg-gray-400 text-gray-800\">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
```