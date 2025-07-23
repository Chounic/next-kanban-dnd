import TaskBoard from "@/components/TaskBoard";
import { auth } from "@/auth";
import { Task, TasksOrder } from "@/database/kysely";
import { getTasks, getTasksOrder } from "@/action/tasks-server";

export interface TaskWithSubTasks {
  task: Task;
  subTasks: Task[];
}

export default async function TaskManagementPage() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) return null;

  let tasksWithSubTasks: TaskWithSubTasks[] = [];
  let tasksOrder: TasksOrder = {};

  try {
    const [tasks, order] = await Promise.all([
      getTasks(user.id),
      getTasksOrder(user.id)
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
    <main className="flex flex-col flex-1">
      <TaskBoard tasksWithSubTasks={tasksWithSubTasks} tasksOrder={tasksOrder} userId={user.id} />
    </main>
  );
}
