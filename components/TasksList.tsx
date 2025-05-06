"use client";

import { useEffect, useState } from "react";
import { TasksOrder } from "@/database/kysely";
import TaskCard from "./TaskCard";
import { TaskStatus } from "@/utils/registry";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { updateTask, updateTasksOrder } from "@/action/tasks-server";
import { TaskWithSubTasks } from "./TaskBoard";
import { Squircle } from "lucide-react";

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
    <div className="flex gap-1 flex-1">
      <DragDropContext onDragEnd={handleDragEnd}>
        {taskStatusEntries.map((taskStatus) => {
          const [key, value] = taskStatus;
          return (
            <div
              key={value}
              className={cn(
                "border rounded-sm w-1/4 bg-stone-50 p-2  has-[:checked]:ring-blue-600 has-[:checked]:ring-2 has-[:checked]:border-transparent border-gray-300 flex flex-col"
              )}
            >
              <div className="p-2 min-h-[100px]">
                <div className="flex items-center gap-1 mb-2">
                  <Squircle size={16} />
                  <h2 className="font-semibold">{toTitleCase(key)}</h2>
                </div>
                {/* <div className="text-sm text-gray-500">
                      description description description description
                      description
                    </div> */}
              </div>
              <Droppable droppableId={value}>
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1"
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={snapshot.isDraggingOver}
                        readOnly
                      />
                      {taskColumns[value]?.map((id, index) => {
                        const t = tasksWithSubTasks.find(
                          (t) => t.task.uuid === id
                        );

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
                                className={cn(
                                  "",
                                  snapshot.isDragging
                                    ? " ring-blue-600 ring-2 border-transparent"
                                    : "border-gray-300"
                                )}
                              />
                            )}
                          </Draggable>
                        ) : null;
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
