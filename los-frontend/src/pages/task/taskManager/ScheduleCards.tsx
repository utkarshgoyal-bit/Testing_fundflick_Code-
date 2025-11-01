import NoTaskFound from '@/components/ui/notTaskFound';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ACCEPT_TASK,
  DELETE_SCHEDULED_RECURRING_TASK,
  MARK_AS_COMPLETED_TASK,
  PIN_TASK,
  STOP_REPEAT_TASK,
  UPDATE_SCHEDULED_RECURRING_TASK,
} from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { NewTask } from './newTask';
import { ITaskFormType } from './formSchema';
import ScheduleCard from './ScheduleCard';

export default function ScheduleCards({
  timezone,
  formatDate,
  searchQuery,
}: {
  timezone: string;
  formatDate: string;
  searchQuery?: string;
}) {
  const { data: allTasks, loading } = useSelector((state: RootState) => state.tasks);
  const { data: userData } = useSelector((state: RootState) => state.login);
  const loggedInUserId = userData?.employment?._id || '';
  const dispatch = useDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const onMarkTaskAsCompletedHandler = (item: any) => {
    dispatch({ type: MARK_AS_COMPLETED_TASK, payload: { _id: item._id } });
  };
  const onStopRepeatTaskHandler = (item: any) => {
    dispatch({ type: STOP_REPEAT_TASK, payload: { taskId: item.taskId } });
  };

  const onAcceptTaskHandler = (item: any) => {
    dispatch({ type: ACCEPT_TASK, payload: { taskId: item._id } });
  };
  const onPinTaskHandler = (item: any) => {
    dispatch({ type: PIN_TASK, payload: { taskId: item._id } });
  };

  const onEditTaskHandler = (item: any) => {
    setSelectedTask(item);
    setEditDialogOpen(true);
  };

  const onEditTaskSubmitHandler = (payload: ITaskFormType & { _id?: string }) => {
    dispatch({ type: UPDATE_SCHEDULED_RECURRING_TASK, payload });
    setEditDialogOpen(false);
    setSelectedTask(null);
  };

  const onDeleteTaskHandler = (item: any) => {
    dispatch({ type: DELETE_SCHEDULED_RECURRING_TASK, payload: { _id: item._id } });
  };

  const filteredTasks = allTasks.filter(
    (task: any) =>
      !searchQuery ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.dueDateInMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskComment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-full mt-6 max-w-7xl max-md:w-full mx-auto md:px-4 text-colo">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-20 bg-color-surface-muted rounded-lg" />
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((item: any) => (
            <ScheduleCard
              item={item}
              userData={userData}
              formatDate={formatDate}
              onMarkTaskAsCompletedHandler={onMarkTaskAsCompletedHandler}
              onStopRepeatTaskHandler={onStopRepeatTaskHandler}
              onDeleteTaskHandler={onDeleteTaskHandler}
              onAcceptTaskHandler={onAcceptTaskHandler}
              onPinTaskHandler={onPinTaskHandler}
              onEditTaskHandler={onEditTaskHandler}
              loggedInUserId={loggedInUserId}
              timezone={timezone}
            />
          ))}
        </div>
      ) : allTasks.length > 0 && filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tasks found matching "{searchQuery}"</div>
      ) : (
        <NoTaskFound />
      )}

      <Sheet open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <SheetContent className="w-[1000px] sm:w-[540px] overflow-y-auto max-h-[100vh]">
          <SheetHeader>
            <SheetTitle>Edit Task</SheetTitle>
            <SheetDescription>Edit the task details below and save the changes</SheetDescription>
          </SheetHeader>
          {selectedTask && (
            <NewTask
              timezone={timezone}
              formatDate={formatDate}
              onAddTaskHandler={onEditTaskSubmitHandler}
              isCAType={false}
              task={selectedTask}
            />
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
