import { db, Task, TasksOrder } from "@/database/kysely";
import SearchBar from "./SearchBar";
import CreateTaskButton from "./CreateTaskButton";
import TasksList from "./TasksList";
import { getTasksOrder } from "@/action/tasks-server";

export interface TaskWithSubTasks {
  task: Task;
  subTasks: Task[];
}

export default async function TaskBoard({ userId }: { userId: string }) {
  let tasksWithSubTasks: TaskWithSubTasks[] = [];
  let tasksOrder: TasksOrder = {};

  try {
    const tasks = await db
      .selectFrom("tasks")
      .where("userId", "=", userId)
      .where("archived", "=", false)
      .selectAll()
      .execute();

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

    tasksOrder = await getTasksOrder(userId);
  } catch (e: any) {
    console.error(e);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-16">
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
