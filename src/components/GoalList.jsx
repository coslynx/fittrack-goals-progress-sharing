```jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { get } from '../services/api';
import Modal from './Modal';

interface Goal {
  id: string;
  name: string;
  description: string;
  targetDate: string;
}

const GoalList: React.FC = () => {
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sanitizeInput } = useContext(AuthContext);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await get('/api/goals');
        if (data && Array.isArray(data)) {
          const sanitizedGoals = data.map(goal => ({
            id: goal.id,
            name: sanitizeInput(goal.name),
            description: sanitizeInput(goal.description),
            targetDate: sanitizeInput(goal.targetDate)
          }));
          setGoals(sanitizedGoals);
          setError(null);
        } else {
          setGoals(null);
          setError('Failed to fetch goals: Data is not an array.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch goals.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [sanitizeInput]);

    const handleViewDetails = (goal: Goal) => {
      setSelectedGoal(goal);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedGoal(null);
    };

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading goals...</div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!goals) {
    return <div className="flex justify-center items-center">No goals set yet.</div>;
  }

  return (
    <>
      <ul className="list-none p-0">
        {goals.map((goal) => (
          <li key={goal.id} className="mb-4 p-4 rounded shadow-md bg-white">
            <h3 className="text-lg font-bold text-gray-800">{goal.name}</h3>
            <p className="text-gray-700">{goal.description}</p>
            <p className="text-gray-600">Target Date: {goal.targetDate}</p>
            <button
                onClick={() => handleViewDetails(goal)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
       {selectedGoal && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Goal Details</h2>
          <h3 className="text-lg font-bold text-gray-800">{selectedGoal.name}</h3>
          <p className="text-gray-700">{selectedGoal.description}</p>
          <p className="text-gray-600">Target Date: {selectedGoal.targetDate}</p>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal>
      )}
    </>
  );
};

export default GoalList;
```