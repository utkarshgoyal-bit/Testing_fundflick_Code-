import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeline } from '@/components/ui/timeline';
import camelToTitle from '@/helpers/camelToTitle';
import { toFormatDate } from '@/helpers/dateFormater';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { STATUS, TASK_STATUS } from '@/lib/enums';
import { REPEAT_STATUS } from '@/lib/enums/task';
import { ITaskTable } from '@/lib/interfaces';
import { cn } from '@/lib/utils';
import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  FileText,
  IndianRupee,
  MessageSquare,
  MoreHorizontal,
  Pin,
  PinOff,
  RefreshCcw,
  RefreshCwOff,
  Scale,
  Trash,
  Users,
} from 'lucide-react';
import moment from 'moment-timezone';
import Comments from './comments';
import getStatusColor from '@/helpers/getStatusColor';
import getStatusLine from '@/helpers/getStatusLine';
import getStatusDot from '@/helpers/getStatusDot';

const priorityOfTask = {
  1: {
    label: 'Low',
    color: 'text-color-success border-color-success',
  },
  2: {
    label: 'Medium',
    color: 'text-color-warning border-color-warning',
  },
  3: {
    label: 'High',
    color: 'text-color-error border-color-error',
  },
};

const getPriorityColor = (dueDate: string) => {
  const daysDiff = moment(dueDate).diff(moment(), 'days');
  if (daysDiff <= 1) return 'text-color-error';
  if (daysDiff <= 3) return 'text-color-black';
  return 'text-fg-secondary';
};

const taskName = (item: any) => {
  return item?.type?.toLocaleLowerCase() === 'ca'
    ? `Return: ${item?.returnName || item.serviceId?.serviceName}`
    : item?.type?.toLocaleLowerCase() !== 'other'
      ? camelToTitle(item?.type || '-')
      : item?.title;
};
const TaskCard = ({
  item,
  userData,
  loggedInUserId,
  formatDate,
  onMarkTaskAsCompletedHandler,
  onStopRepeatTaskHandler,
  onDeleteTaskHandler,
  onAcceptTaskHandler,
  onPinTaskHandler,
}: {
  item: ITaskTable;
  userData: any;
  loggedInUserId: string;
  formatDate: string;
  onMarkTaskAsCompletedHandler: (item: any) => void;
  onStopRepeatTaskHandler: (item: any) => void;
  onDeleteTaskHandler: (item: any) => void;
  onAcceptTaskHandler: (item: any) => void;
  onPinTaskHandler: (item: any) => void;
}) => {
  const dueDate = moment(item.startDate).add(item.dueAfterDays, 'days');
  const isOverdue = dueDate.isBefore(moment());
  const daysDiff = dueDate.diff(moment(), 'days');
  const isCreatedUser = userData?.employment?._id === item?.createdBy?._id;
  const isLoggedInUser = item?.users?.find((user: any) => user.employeeId === loggedInUserId);
  const isAccepted = item.acceptedBy && item.status == TASK_STATUS.IN_PROGRESS;
  let canAccept = false;
  if (isLoggedInUser) {
    canAccept = item.status == TASK_STATUS.PENDING || item.status == TASK_STATUS.UPCOMING;
  }
  const canRepeat = item.repeat !== REPEAT_STATUS.NO_REPEAT && hasPermission(PERMISSIONS.TASK_REPEAT);
  const canDelete = isCreatedUser && hasPermission(PERMISSIONS.TASK_DELETE);
  const isUnderReview = item.status == TASK_STATUS.UNDER_REVIEW && item.createdBy._id === loggedInUserId;
  return (
    <div
      key={item._id + 'task'}
      className={`group bg-color-surface border rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden ${
        isOverdue ? 'border-color-error/30 bg-color-error/5' : 'border-fg-border hover:border-color-primary/30'
      }`}
    >
      <div className="p-3 sm:p-4">
        <div className="md:hidden space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 mt-1 flex-shrink-0">
                <div className={cn('w-3 h-3 rounded-full', getStatusDot(item.status))} />
                <div className={cn('w-px h-8 bg-fg-border', getStatusLine(item.status))} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-fg-primary text-sm leading-tight break-words mb-2">
                  {taskName(item)}
                </h3>
                <span className={`px-2 py-1  rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {camelToTitle(item.status || STATUS.PENDING)}
                </span>
                {item.clientId && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-fg-tertiary" />
                    <span className="text-xs text-fg-tertiary">Client:</span>
                    <span className="text-fg-secondary font-medium">
                      {item.clientId?.name}({item.clientId?.email})
                    </span>
                  </div>
                )}
                {item.serviceId && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-fg-tertiary" />
                    <span className="text-xs text-fg-tertiary">Service:</span>
                    <span className="text-fg-secondary font-medium">{item.serviceId?.serviceName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Actions - Right Aligned */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              {
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-color-success/10 hover:text-color-success hover:border-color-success/30"
                  onClick={() => onMarkTaskAsCompletedHandler(item)}
                >
                  <Pin className="h-3.5 w-3.5" />
                </Button>
              }
              {isAccepted && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-color-success/10 hover:text-color-success hover:border-color-success/30"
                  onClick={() => onMarkTaskAsCompletedHandler(item)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
              )}
              {isUnderReview && (
                <Button
                  variant="outline"
                  size="lg"
                  className="h-8 w-8 p-0 hover:bg-color-success/10 hover:text-color-success hover:border-color-success/30"
                  onClick={() => onMarkTaskAsCompletedHandler(item)}
                >
                  Approve
                </Button>
              )}

              {canRepeat && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-color-warning/10 hover:text-color-warning"
                  onClick={() => onStopRepeatTaskHandler(item)}
                >
                  <RefreshCwOff className="h-3.5 w-3.5" />
                </Button>
              )}

              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-color-error/10 hover:text-color-error"
                  onClick={() => onDeleteTaskHandler(item)}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Description - Left Aligned */}
          <div className="ml-6">
            <p className="text-xs text-fg-secondary line-clamp-2 leading-relaxed">{item.description}</p>
          </div>

          {/* Meta Info and Accept Button Row */}
          <div className="flex items-center justify-between gap-3 ml-6">
            {/* Meta Info - Left Aligned */}
            <div className="flex flex-wrap gap-2 flex-1">
              <div className="flex items-center gap-1.5 bg-color-surface-muted/50 px-2 py-1 rounded-lg border border-fg-border/30">
                <FileText className="h-3 w-3 text-fg-tertiary" />
                <span className="text-xs text-fg-secondary font-medium">{item.taskId}</span>
              </div>

              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                  isOverdue
                    ? 'bg-color-error/10 border border-color-error/20'
                    : daysDiff <= 1
                      ? 'bg-color-warning/10 border border-color-warning/20'
                      : 'bg-color-success/10 border border-color-success/20'
                }`}
              >
                <Calendar className={`h-3 w-3 ${getPriorityColor(dueDate.format())}`} />
                <span className={`text-xs font-medium ${getPriorityColor(dueDate.format())}`}>
                  {isOverdue
                    ? 'Overdue'
                    : daysDiff === 0
                      ? 'Due Today'
                      : daysDiff === 1
                        ? 'Due Tomorrow'
                        : daysDiff === 2
                          ? 'Due in 2 days'
                          : dueDate.format('MMM Do')}
                </span>
              </div>

              {item.caseNo && (
                <div className="flex items-center gap-1.5 bg-color-secondary/10 px-2 py-1 rounded-lg border border-color-secondary/20">
                  <span className="text-xs text-color-secondary font-medium">{item?.caseNo}</span>
                </div>
              )}

              {item?.type === 'payment' && (
                <div className="flex items-center gap-1.5 bg-color-accent/10 px-2 py-1 rounded-lg border border-color-accent/20">
                  <IndianRupee className="h-3 w-3 text-color-accent" />
                  <span className="text-xs text-color-accent font-medium">{item?.amount}</span>
                </div>
              )}
            </div>

            {/* Accept Task Button - Right Aligned */}
            {canAccept && (
              <Button
                size="sm"
                className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent px-3 py-1.5 h-auto text-xs font-medium flex-shrink-0"
                onClick={() => onAcceptTaskHandler(item)}
              >
                Accept
              </Button>
            )}
          </div>

          {/* People Row */}
          <div className="flex items-center justify-between ml-6">
            {/* Creator - Left Aligned */}
            <div className="flex items-center gap-2 flex-1">
              <div className="h-5 w-5 rounded-full bg-color-primary/10 flex items-center justify-center">
                <span className="text-color-primary font-medium text-xs">
                  {item.createdBy?.firstName?.charAt(0)}
                  {item.createdBy?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <span className="text-xs text-fg-tertiary">Created by</span>
                <p className="text-xs font-medium text-fg-secondary">
                  {item.createdBy?.firstName} {item.createdBy?.lastName}
                </p>
              </div>
            </div>

            {/* Assignees - Right Aligned */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Users className="h-3.5 w-3.5 text-fg-tertiary" />
              <div className="flex items-center gap-1.5">
                {item.users &&
                  item.users.slice(0, 2).map((user: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-color-secondary/10 px-2 py-0.5 rounded-full border border-color-secondary/20"
                    >
                      <div className="h-3.5 w-3.5 rounded-full bg-color-secondary/20 flex items-center justify-center">
                        <span className="text-color-secondary font-medium text-xs">{user.name?.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-medium text-color-secondary truncate max-w-[50px]">
                        {user.name}
                      </span>
                      {user.employeeId === item.acceptedBy && (
                        <CheckCircle2 className="h-2.5 w-2.5 text-color-success" />
                      )}
                    </div>
                  ))}
                {item.users && item.users.length > 2 && (
                  <Popover>
                    <PopoverTrigger>
                      <span className="text-xs text-color-secondary font-medium bg-color-secondary/10 px-2 py-0.5 rounded-full border border-color-secondary/20">
                        +{item.users.length - 2}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2 p-2">
                      {item.users.slice(2).map((user: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 bg-color-secondary/10 px-2 py-1 rounded-full border border-color-secondary/20"
                        >
                          <div className="h-4 w-4 rounded-full bg-color-secondary/20 flex items-center justify-center">
                            <span className="text-color-secondary font-medium text-xs">{user.name?.charAt(0)}</span>
                          </div>
                          <span className="text-xs font-medium text-color-secondary">{user.name}</span>
                          {user.employeeId === item.acceptedBy && (
                            <CheckCircle2 className="h-3 w-3 text-color-success" />
                          )}
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-start justify-between">
          {/* Left Side - Task Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="flex flex-col items-center gap-2 mt-1">
              <div className={cn('w-3 h-3 rounded-full', getStatusDot(item.status))} />
              <div className={cn('w-px h-8 bg-fg-border', getStatusLine(item.status))} />
            </div>

            {/* Task Content */}
            <div className="flex-1 space-y-2">
              {/* Task Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-fg-primary text-base leading-tight">{taskName(item)}</h3>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                    >
                      {camelToTitle(item.status || STATUS.PENDING)}
                    </span>
                  </div>
                  <p className="text-sm text-fg-secondary line-clamp-2 mb-2">{item.description}</p>
                </div>
              </div>

              {/* Task Meta Info */}
              <div className="flex items-center gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-fg-tertiary" />
                  <span className="text-xs text-fg-tertiary">Task Id:</span>
                  <span className="text-fg-secondary font-medium"> {item.taskId}</span>
                </div>
                {item.clientId && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-fg-tertiary" />
                    <span className="text-xs text-fg-tertiary">Client:</span>
                    <span className="text-fg-secondary font-medium">
                      {item.clientId?.name}({item.clientId?.email})
                    </span>
                  </div>
                )}
                {item.serviceId && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-fg-tertiary" />
                    <span className="text-xs text-fg-tertiary">Service:</span>
                    <span className="text-fg-secondary font-medium">{item.serviceId?.serviceName}</span>
                  </div>
                )}
                {item.repeat !== REPEAT_STATUS.NO_REPEAT && (
                  <div className="flex items-center gap-1.5">
                    <RefreshCcw className="h-3.5 w-3.5 text-fg-tertiary" />
                    <span className="text-xs text-fg-tertiary">Repeat Type:</span>
                    <span className="text-fg-secondary font-medium">
                      {item.repeat === 'weekly'
                        ? `Weekly on ${item.weeklyDay}`
                        : item.repeat === 'monthly'
                          ? `Monthly on ${item.monthlyDay}`
                          : `Yearly on  ${item?.yearlyDay || ''}/${item?.yearlyMonth || ''} `}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-fg-tertiary" />
                  <span className="text-xs text-fg-tertiary">Priority:</span>
                  <span
                    className={cn(
                      priorityOfTask[item.priorityOfTask as keyof typeof priorityOfTask]?.color,
                      'px-2 py-0.5 rounded-full text-xs font-medium border'
                    )}
                  >
                    {priorityOfTask[item.priorityOfTask as keyof typeof priorityOfTask]?.label || '-'}
                  </span>
                </div>

                {item.caseNo && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-fg-tertiary">Case No:</span>
                    <span className="text-fg-secondary font-medium">{item?.caseNo || '-'}</span>
                  </div>
                )}

                {item?.type === 'payment' && (
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-color-accent" />
                    <span className="text-fg-secondary font-medium">{item?.amount || '-'}</span>
                  </div>
                )}
              </div>

              {/* Creator & Assignees */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-color-primary/10 flex items-center justify-center">
                    <span className="text-color-primary font-medium text-xs">
                      {item.createdBy?.firstName?.charAt(0)}
                      {item.createdBy?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-fg-tertiary">Created by</span>
                    <p className="text-sm font-medium text-fg-secondary">
                      {item.createdBy?.firstName} {item.createdBy?.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-fg-tertiary" />
                  <div className="flex flex-wrap items-center gap-2">
                    {item.users &&
                      item.users.slice(0, 2).map((user: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 bg-color-secondary/10 px-2 py-1 rounded-full border border-color-secondary/20"
                        >
                          <div className="h-4 w-4 rounded-full bg-color-secondary/20 flex items-center justify-center">
                            <span className="text-color-secondary font-medium text-xs">{user.name?.charAt(0)}</span>
                          </div>
                          <span className="text-xs font-medium text-color-secondary">{user.name}</span>
                          {user.employeeId === item.acceptedBy && (
                            <CheckCircle2 className="h-3 w-3 text-color-success" />
                          )}
                        </div>
                      ))}
                    {item.users && item.users.length > 2 && (
                      <Popover>
                        <PopoverTrigger>
                          <MoreHorizontal className="text-color-secondary  font-light text-xs" />
                        </PopoverTrigger>
                        <PopoverContent className="space-y-2 p-2 ">
                          {item.users.slice(2).map((user: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 bg-color-secondary/10 px-2 py-1 rounded-full border border-color-secondary/20"
                            >
                              <div className="h-4 w-4 rounded-full bg-color-secondary/20 flex items-center justify-center">
                                <span className="text-color-secondary font-medium text-xs">{user.name?.charAt(0)}</span>
                              </div>
                              <span className="text-xs font-medium text-color-secondary">{user.name}</span>
                              {user.employeeId === item.acceptedBy && (
                                <CheckCircle2 className="h-3 w-3 text-color-success" />
                              )}
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!!item.cc?.length && <p className=" text-fg-tertiary">CC</p>}
                  <div className="flex flex-wrap items-center gap-2">
                    {!!item.cc?.length &&
                      item.cc.slice(0, 2).map((user: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 bg-color-secondary/10 px-2 py-1 rounded-full border border-color-secondary/20"
                        >
                          <div className="h-4 w-4 rounded-full bg-color-secondary/20 flex items-center justify-center">
                            <span className="text-color-secondary font-medium text-xs">{user.name?.charAt(0)}</span>
                          </div>
                          <span className="text-xs font-medium text-color-secondary">{user.name}</span>
                          {user.employeeId === item.acceptedBy && (
                            <CheckCircle2 className="h-3 w-3 text-color-success" />
                          )}
                        </div>
                      ))}
                    {item.cc && item.cc.length > 2 && (
                      <Popover>
                        <PopoverTrigger>
                          <MoreHorizontal className="text-color-secondary  font-light text-xs" />
                        </PopoverTrigger>
                        <PopoverContent className="space-y-2 p-2 ">
                          {item.cc.slice(2).map((user: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 bg-color-secondary/10 px-2 py-1 rounded-full border border-color-secondary/20"
                            >
                              <div className="h-4 w-4 rounded-full bg-color-secondary/20 flex items-center justify-center">
                                <span className="text-color-secondary font-medium text-xs">{user.name?.charAt(0)}</span>
                              </div>
                              <span className="text-xs font-medium text-color-secondary">{user.name}</span>
                              {user.employeeId === item.acceptedBy && (
                                <CheckCircle2 className="h-3 w-3 text-color-success" />
                              )}
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2 ml-4 flex-wrap">
            {
              <Button variant="ghost" onClick={() => onPinTaskHandler(item)}>
                {item.isPinned ? <Pin className="h-4 w-4 text-success" /> : <PinOff className="h-4 w-4 " />}
              </Button>
            }
            {isUnderReview && (
              <Button
                variant="outline"
                size="lg"
                className="h-8 px-2 hover:bg-color-success/10 hover:text-color-success hover:border-color-success/30"
                onClick={() => onMarkTaskAsCompletedHandler(item)}
              >
                Approve
              </Button>
            )}
            {isAccepted && (
              <Button variant="ghost" onClick={() => onMarkTaskAsCompletedHandler(item)}>
                <CheckCircle2 className="h-4 w-4 text-color-success" />
              </Button>
            )}

            {canRepeat && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-color-warning/10 hover:text-color-warning"
                onClick={() => onStopRepeatTaskHandler(item)}
              >
                <RefreshCwOff className="h-4 w-4" />
              </Button>
            )}

            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-color-error/10 hover:text-color-error">
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from
                      our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDeleteTaskHandler(item)}
                      className="bg-color-error hover:bg-color-error-light text-fg-on-accent px-4"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {canAccept && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent px-4">
                    Accept
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Accept Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Accepting this task will confirm that you have received the task and will be responsible for
                      completing it. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onAcceptTaskHandler(item)}
                      className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent px-4"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* <ChevronRight className="h-4 w-4 text-fg-tertiary group-hover:text-color-primary transition-colors" /> */}
          </div>
        </div>
      </div>

      {/* Comments & Timeline Tabs */}
      <div className="border-t border-fg-border bg-color-surface-muted/50 px-3 sm:px-4 py-2 sm:py-3">
        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments{' '}
              <span className="text-fg-tertiary inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full border border-fg-border bg-fg-primary/5">
                {item.comments?.length > 9 ? '9+' : item.comments?.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Timeline{' '}
              <span className="text-fg-tertiary inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full border border-fg-border bg-fg-primary/5">
                {item.timeline?.length > 9 ? '9+' : item.timeline?.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="mt-3">
            {hasPermission(PERMISSIONS.TASK_COMMENT) ? (
              <Comments task={item} />
            ) : (
              <p className="text-sm text-fg-tertiary text-center py-4">You don't have permission to view comments</p>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-3">
            <Timeline
              timelineData={item.timeline?.map((timeline) => ({
                content: timeline.comment,
                date: toFormatDate({ date: timeline.createdAt, toFormat: formatDate }),
                title: '',
                name: timeline.createdByName && `By : ${timeline.createdByName || ''}`,
              }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskCard;
