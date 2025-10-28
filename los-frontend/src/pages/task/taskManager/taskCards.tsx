import NoTaskFound from '@/components/ui/notTaskFound';
import { Skeleton } from '@/components/ui/skeleton';
import { ACCEPT_TASK, DELETE_TASK, MARK_AS_COMPLETED_TASK, PIN_TASK, STOP_REPEAT_TASK } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { Target } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import TaskCard from './TaskCard';

export default function TaskCards({ formatDate }: { formatDate: string }) {
  const { data: allTasks, loading } = useSelector((state: RootState) => state.tasks);
  const { data: userData } = useSelector((state: RootState) => state.login);
  const loggedInUserId = userData?.employment?._id || '';
  const dispatch = useDispatch();

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

  return (
    <section className="w-full mt-6 max-w-7xl max-md:w-full mx-auto md:px-4 text-colo">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-20 bg-color-surface-muted rounded-lg" />
          ))}
        </div>
      ) : allTasks.length > 0 ? (
        <div className="space-y-2">
          <div className="bg-color-surface border border-fg-border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-color-primary/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-color-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-fg-primary">Task Management</h2>
                  <p className="text-sm text-fg-secondary">{allTasks.length} tasks found</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-fg-tertiary">
                <span>Sort by priority & due date</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {allTasks.map((item: any) => (
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
              />
            ))}
          </div>
        </div>
      ) : (
        <NoTaskFound />
      )}
    </section>
  );
}
