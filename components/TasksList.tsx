"use client";

import { useEffect, useState } from "react";
import { Task, TasksOrder } from "@/database/kysely";
import TaskCard from "./TaskCard";
import { TaskStatus } from "@/utils/registry";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { updateTask, updateTasksOrder } from "@/action/tasks-server";
import { TaskWithSubTasks } from "./TaskBoard";

const taskStatusEntries = Object.entries(TaskStatus);

function toTitleCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

export default function TasksList({
  tasksWithSubTasks,
  order,
  userId,
}: {
  tasksWithSubTasks: TaskWithSubTasks[];
  order: TasksOrder;
  userId: string;
}) {
  // Setup two containers with initial items
  const [taskColumns, setTaskColumns] = useState<TasksOrder>({});

  useEffect(() => {
    setTaskColumns(() => {
      const defaultTaskColumns: TasksOrder = {};

      taskStatusEntries.forEach((taskStatus) => {
        const [key, value] = taskStatus;

        defaultTaskColumns[value] = [];
      });

      const nextTaskColumns = { ...defaultTaskColumns, ...order };

      return nextTaskColumns;
    });
  }, [tasksWithSubTasks, order]);

  function handleDragEnd(result) {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const targetList = [...(taskColumns[destination.droppableId] || [])];
    let nextTaskColumns: TasksOrder = {};

    if (source.droppableId === destination.droppableId) {
      const [removed] = targetList.splice(source.index, 1);
      targetList.splice(destination.index, 0, removed);
      nextTaskColumns = {
        ...taskColumns,
        [destination.droppableId]: targetList,
      };

      setTaskColumns(nextTaskColumns);
    } else {
      const sourceList = [...(taskColumns[source.droppableId] || [])];
      const [removed] = sourceList.splice(source.index, 1);
      targetList.splice(destination.index, 0, removed);
      nextTaskColumns = {
        ...taskColumns,
        [source.droppableId]: sourceList,
        [destination.droppableId]: targetList,
      };
      setTaskColumns(nextTaskColumns);
      updateTask({ status: destination.droppableId, uuid: draggableId }, false);
    }

    updateTasksOrder(nextTaskColumns, userId);
  }

  return (
    <div className="flex">
      <DragDropContext onDragEnd={handleDragEnd}>
        {taskStatusEntries.map((taskStatus) => {
          const [key, value] = taskStatus;
          return (
            <Droppable key={value} droppableId={value}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={cn(
                    "border-gray-500 border-dashed border-2 flex-1",
                    snapshot.isDraggingOver ? " bg-green-400" : "bg-white"
                  )}
                  {...provided.droppableProps}
                >
                  <h2 className="font-semibold mb-2">{toTitleCase(key)}</h2>

                  {taskColumns[value]?.map((id, index) => {
                    const t = tasksWithSubTasks.find((t) => t.task.uuid === id);

                    return t ? (
                      <Draggable
                        key={t.task.uuid}
                        draggableId={t.task.uuid}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <TaskCard
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            task={t}
                          />
                        )}
                      </Draggable>
                    ) : null;
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
  );
}
