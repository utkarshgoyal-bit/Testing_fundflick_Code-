import { Button } from '@/components/ui/button';
import TeamDashboard from './teamDashboard';
import { useEffect, useState } from 'react';
import IndividualDashboard from './IndividualDashboard';
import { useDispatch } from 'react-redux';
import { FETCH_TASKS_DASHBOARD_DATA } from '@/redux/actions/types';

export default function TaskDashboard() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('team');
  useEffect(() => {
    dispatch({ type: FETCH_TASKS_DASHBOARD_DATA, payload: { type: activeTab } });
  }, [activeTab]);
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
      {activeTab === 'individual' && <IndividualDashboard />}
      {activeTab === 'team' && <TeamDashboard />}
    </div>
  );
}
