import { Task, TasksOrder } from "@/database/kysely";
import SearchBar from "./SearchBar";
import CreateTaskButton from "./CreateTaskButton";
import TasksList from "./TasksList";
import { getTasks, getTasksOrder } from "@/action/tasks-server";

export interface TaskWithSubTasks {
  task: Task;
  subTasks: Task[];
}

export default async function TaskBoard({ userId }: { userId: string }) {
  let tasksWithSubTasks: TaskWithSubTasks[] = [];
  let tasksOrder: TasksOrder = {};

  try {
    const [tasks, order] = await Promise.all([
      getTasks(userId),
      getTasksOrder(userId)
    ]);

    const taskMap: Record<string, TaskWithSubTasks> = {};
    for (const task of tasks) {
      taskMap[task.id] = { task, subTasks: [] };
    }
    // Attach subtasks to their parent
    for (const task of tasks) {
      if (task.parentTaskId && taskMap[task.parentTaskId]) {
        taskMap[task.parentTaskId].subTasks.push(taskMap[task.id].task);
      }
    }
    tasksWithSubTasks = Object.values(taskMap);
    tasksOrder = order
  } catch (e: any) {
    console.error(e);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <SearchBar />
        <CreateTaskButton />
      </div>
      <TasksList
        tasksWithSubTasks={tasksWithSubTasks}
        order={tasksOrder}
        userId={userId}
      />
    </>
  );
}
