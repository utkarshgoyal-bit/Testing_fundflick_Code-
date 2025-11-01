import { Button } from '@/components/ui/button';
import { FETCH_TASKS_DASHBOARD_DATA } from '@/redux/actions/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import IndividualDashboard from './IndividualDashboard';
import TeamDashboard from './teamDashboard';

export default function TaskDashboard() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('individual');
  const [incompleteTasksFilter, setIncompleteTasksFilter] = useState<'pending' | 'inProgress'>('pending');
  useEffect(() => {
    dispatch({ type: FETCH_TASKS_DASHBOARD_DATA, payload: { type: activeTab, incompleteTasksFilter } });
  }, [activeTab, incompleteTasksFilter]);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Overall Summary</h1>
        <div className="flex gap-2">
          <Button variant={activeTab === 'team' ? 'secondary' : 'outline'} onClick={() => setActiveTab('team')}>
            Team
          </Button>
          <Button
            variant={activeTab === 'individual' ? 'secondary' : 'outline'}
            onClick={() => setActiveTab('individual')}
          >
            Individual
          </Button>
        </div>
      </div>
      {activeTab === 'individual' && <IndividualDashboard setIncompleteTasksFilter={setIncompleteTasksFilter} />}
      {activeTab === 'team' && <TeamDashboard setIncompleteTasksFilter={setIncompleteTasksFilter} />}
    </div>
  );
}
