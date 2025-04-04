import TaskCard from "./TaskCard";
import { db, Task } from "@/lib/kysely";

interface TaskWithSubTasks {
  task: Task;
  subTasks: Task[];
}

export default async function TaskBoard({ userId }: { userId: string }) {
  const columns = ["Backlog", "Ready", "In Progress", "Done"];
  let tasksWithSubTasks: TaskWithSubTasks[] = [];

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
  } catch (e: any) {
    console.error(e);
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map((column) => (
        <div key={column} className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">{column}</h2>
          {tasksWithSubTasks
            .filter(
              (t) =>
                t.task.status.toLowerCase() ===
                column.toLowerCase().replace(" ", "-")
            )
            .map((t) => (
              <TaskCard key={t.task.id} task={t.task} subTasks={t.subTasks} />
            ))}
        </div>
      ))}
    </div>
  );
}
