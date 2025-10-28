import moment from "moment";
import TasksSchema from "../../models/tasks";

export default async function createRepeatedTasks(taskId: number) {
  try {
    const [task] = await TasksSchema.find({ taskId }).sort({ createdAt: -1 }).limit(1);
    if (!task) {
      console.error("Task not found for taskId:", taskId);
      return;
    }

    const { repeat, startDate, dueAfterDays, organization } = task;
    const start = moment(startDate);
    const due = moment(startDate).add(dueAfterDays, "days");
    const today = moment();

    if (!repeat || today.isAfter(due)) {
      console.warn("Repeat not set or due date passed. Skipping task creation.");
      return;
    }

    let nextStartDate: moment.Moment;

    if (repeat === "weekly") {
      nextStartDate = moment(startDate).add(1, "week");
    } else if (repeat === "monthly") {
      nextStartDate = moment(startDate).add(1, "month");
    } else if (repeat === "yearly") {
      nextStartDate = moment(startDate).add(1, "year");
    } else {
      console.warn('Repeat type not supported or is "noRepeat".');
      return;
    }

    const nextDueDate = moment(nextStartDate).add(dueAfterDays, "days");

    await TasksSchema.create({
      ...task.toObject(),
      _id: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: nextStartDate.toDate(),
      dueAfterDays,
      taskId: taskId,
      comments: [],
      status: "Pending",
      organization: organization,
    });

    console.log(`Repeated task created for taskId ${taskId} with startDate ${nextStartDate.format("YYYY-MM-DD")}`);
  } catch (error) {
    console.error("Error creating repeated task:", error);
  }
}
