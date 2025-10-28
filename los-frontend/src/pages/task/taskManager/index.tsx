import TaskManager from './TaskManager';
import { useEffect } from 'react';
import { ADD_TASK, FETCH_TASKS_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFilter, setStatusFilter, setTaskActivePage, setTaskDialogOpen } from '@/redux/slices/tasks';
import { getOrganizationSettings } from '@/redux/slices/organizationConfigs/fetchOrganizationConfigs';
import { isTrue } from '@/helpers/booleanCheck';
import { ITaskFormType } from './formSchema';
const index = () => {
  const dispatch = useDispatch();
  const { activeTab, taskDialogOpen, activeFilter, statusFilter, activePage, total } = useSelector(
    (state: RootState) => state.tasks
  );

  const organizationConfigs = useSelector(getOrganizationSettings);

  const hideTaskHeading = isTrue(organizationConfigs.find(({ id }: { id: string }) => id === 'hideTaskHeading')?.value);
  const timezone = organizationConfigs.find(({ id }: { id: string }) => id === 'timezone')?.value || 'Asia/Kolkata';
  const formatDate = organizationConfigs.find(({ id }: { id: string }) => id === 'formatDate')?.value || 'DD-MM-YYYY';
  const isCAType = isTrue(organizationConfigs.find(({ id }: { id: string }) => id === 'isCAType')?.value || 'false');

  useEffect(() => {
    dispatch({ type: FETCH_TASKS_DATA });
  }, [activeTab, dispatch, activeFilter, statusFilter, activePage]);

  const onSetActiveFilterHandler = (value: string) => {
    dispatch(setActiveFilter(value));
  };
  const onSetStatusFilterHandler = (value: string) => {
    dispatch(setStatusFilter(value));
  };
  const onSetTaskDialogOpenHandler = (value: boolean) => {
    dispatch(setTaskDialogOpen(value));
  };
  const onSetActivePageHandler = (value: number) => {
    dispatch(setTaskActivePage(value));
  };
  const onAddTaskHandler = (payload: ITaskFormType) => {
    dispatch({ type: ADD_TASK, payload: payload });
  };

  return (
    <TaskManager
      statusFilter={statusFilter}
      taskDialogOpen={taskDialogOpen}
      onSetActiveFilterHandler={onSetActiveFilterHandler}
      onSetStatusFilterHandler={onSetStatusFilterHandler}
      onSetTaskDialogOpenHandler={onSetTaskDialogOpenHandler}
      onSetActivePageHandler={onSetActivePageHandler}
      onAddTaskHandler={onAddTaskHandler}
      total={total}
      activePage={activePage}
      hideTaskHeading={hideTaskHeading}
      timezone={timezone}
      formatDate={formatDate}
      isCAType={isCAType}
    />
  );
};

export default index;
