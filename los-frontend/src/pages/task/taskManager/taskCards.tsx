import NoTaskFound from '@/components/ui/notTaskFound';
import { Skeleton } from '@/components/ui/skeleton';
import { ACCEPT_TASK, DELETE_TASK, MARK_AS_COMPLETED_TASK, PIN_TASK, STOP_REPEAT_TASK } from '@/redux/actions/types';
import { RootState } from '@/redux/store';

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import TaskCard from './TaskCard';

export default function TaskCards({ formatDate, timezone }: { formatDate: string; timezone: string }) {
  const { data: allTasks, loading } = useSelector((state: RootState) => state.tasks);
  const { data: userData } = useSelector((state: RootState) => state.login);
  const loggedInUserId = userData?.employment?._id || '';
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');

  const onMarkTaskAsCompletedHandler = (item: any) => {
    dispatch({ type: MARK_AS_COMPLETED_TASK, payload: { _id: item._id } });
  };
  const onStopRepeatTaskHandler = (item: any) => {
    dispatch({ type: STOP_REPEAT_TASK, payload: { taskId: item.taskId } });
  };
  const onDeleteTaskHandler = (item: any) => {
    dispatch({ type: DELETE_TASK, payload: { _id: item._id } });
  };
  const onAcceptTaskHandler = (item: any) => {
    dispatch({ type: ACCEPT_TASK, payload: { taskId: item._id } });
  };
  const onPinTaskHandler = (item: any) => {
    dispatch({ type: PIN_TASK, payload: { taskId: item._id } });
  };

  const filteredTasks = allTasks.filter(
    (task: any) =>
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.dueDateInMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskComment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-full mt-6 max-w-7xl max-md:w-full mx-auto md:px-4 text-colo">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-20 bg-color-surface-muted rounded-lg" />
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-2">
          <div className="space-y-3">
            {filteredTasks.map((item: any) => (
              <TaskCard
                item={item}
                userData={userData}
                onMarkTaskAsCompletedHandler={onMarkTaskAsCompletedHandler}
                onStopRepeatTaskHandler={onStopRepeatTaskHandler}
                onDeleteTaskHandler={onDeleteTaskHandler}
                onAcceptTaskHandler={onAcceptTaskHandler}
                onPinTaskHandler={onPinTaskHandler}
                loggedInUserId={loggedInUserId}
                formatDate={formatDate}
                timezone={timezone}
              />
            ))}
          </div>
        </div>
      ) : allTasks.length > 0 && filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tasks found matching "{searchQuery}"</div>
      ) : (
        <NoTaskFound />
      )}
    </section>
  );
}
