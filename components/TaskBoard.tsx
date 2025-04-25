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
    tasksWithSubTasks = tasks.map((task) => ({
      task,
      subTasks: tasks.filter((t) => t.parentTaskId === task.id),
    }));

    tasksOrder = await getTasksOrder(userId);
  } catch (e: any) {
    console.error(e);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
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
