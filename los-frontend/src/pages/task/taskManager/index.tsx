import TaskManager from './TaskManager';
import { useEffect } from 'react';
import { ADD_TASK, FETCH_TASKS_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFilter, setStatusFilter, setTaskActivePage, setTaskDialogOpen } from '@/redux/slices/tasks';
import { getOrganizationSettings } from '@/redux/slices/organizationConfigs/fetchOrganizationConfigs';
import { isTrue } from '@/helpers/booleanCheck';
import { ITaskFormType } from './formSchema';
const Index = () => {
  const dispatch = useDispatch();
  const { activeTab, taskDialogOpen, activeFilter, statusFilter, activePage, total } = useSelector(
    (state: RootState) => state.tasks
  );

  const organizationConfigs = useSelector(getOrganizationSettings);
  const hideTaskHeading = isTrue(organizationConfigs.find(({ id }: { id: string }) => id === 'hideTaskHeading')?.value);
  const timezone = organizationConfigs.find(({ id }: { id: string }) => id === 'timezone')?.value || 'Asia/Kolkata';
  const formatDate = organizationConfigs.find(({ id }: { id: string }) => id === 'formatDate')?.value || 'DD-MM-YYYY';
  const reFetchingTaskInterval = Number(
    organizationConfigs.find(({ id }: { id: string }) => id === 'reFetchingTaskInterval')?.value || '0'
  );
  const isCAType = isTrue(organizationConfigs.find(({ id }: { id: string }) => id === 'isCAType')?.value || 'false');

  useEffect(() => {
    dispatch({ type: FETCH_TASKS_DATA });
  }, [activeTab, dispatch, activeFilter, statusFilter, activePage]);

  useEffect(() => {
    if (reFetchingTaskInterval > 0) {
      const pollingInterval = setInterval(() => {
        dispatch({ type: FETCH_TASKS_DATA, payload: { silent: true } });
      }, reFetchingTaskInterval);

      return () => clearInterval(pollingInterval);
    }
  }, [dispatch, reFetchingTaskInterval]);

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
  const onRefreshHandler = () => {
    dispatch({ type: FETCH_TASKS_DATA });
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
      onRefreshHandler={onRefreshHandler}
      total={total}
      activePage={activePage}
      hideTaskHeading={hideTaskHeading}
      timezone={timezone}
      formatDate={formatDate}
      isCAType={isCAType}
      activeFilter={activeFilter}
    />
  );
};

export default Index;
