import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchGoals } from '../store/slices/goalSlice';
import GoalList from '../components/GoalList';
import GoalForm from '../components/GoalForm';
import RuPaySymbol from '../components/ui/RuPaySymbol';

const Goals = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleCloseForm = async () => {
    setShowForm(false);
    setEditingGoal(null);
    // Refresh goals list after form closes to show any updates
    await dispatch(fetchGoals());
  };

  return (
    <div className="p-6">
      <GoalList onEdit={handleEditGoal} />
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Goals;