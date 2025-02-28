import TaskCard from "./TaskCard";
import { db, Task } from "@/lib/kysely";
import { seed } from "@/lib/seed";

export default async function TaskBoard() {
  const columns = ["Backlog", "Ready", "In Progress", "Done"];
  let tasks: Task[] = [];

  try {
    tasks = await db.selectFrom("tasks").selectAll().execute();
  } catch (e: any) {
    if (e.message === `relation "tasks" does not exist`) {
      console.log(
        "Table does not exist, creating and seeding it with dummy data now..."
      );
      // Table is not created yet
      await seed();
    } else {
      throw e;
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map((column) => (
        <div key={column} className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">{column}</h2>
          {tasks
            .filter(
              (task) =>
                task.status.toLowerCase() ===
                column.toLowerCase().replace(" ", "-")
            )
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </div>
      ))}
    </div>
  );
}
