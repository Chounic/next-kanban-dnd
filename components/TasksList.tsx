"use client";

import { startTransition, useEffect, useMemo, useOptimistic, useState } from "react";
import { TasksOrder } from "@/database/kysely";
import TaskCard from "./TaskCard";
import { TaskStatus } from "@/utils/registry";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { deleteTask, updateTask, updateTasksOrder } from "@/action/tasks-server";
import { TaskWithSubTasks } from "./TaskBoard";
import { Squircle } from "lucide-react";
import TaskModal from "./TaskModal";
import { toast } from "sonner";

const taskStatusEntries = Object.entries(TaskStatus);

function toTitleCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

type AddTaskAction = { type: "add"; data: TaskWithSubTasks };
type DeleteTaskAction = { type: "delete"; data: string };
type OptimisticTaskAction = AddTaskAction | DeleteTaskAction;

export default function TasksList({
  tasksWithSubTasks,
  order,
  userId,
}: {
  tasksWithSubTasks: TaskWithSubTasks[];
  order: TasksOrder;
  userId: string;
}) {
  const [tasksOrder, setTasksOrder] = useState<TasksOrder>({});
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasksWithSubTasks,
    (state, action: OptimisticTaskAction) => {
      switch (action.type) {
        case "add":
          return [...state, action.data];
        case "delete":
          return state.filter((task) => task.task.uuid !== action.data);
        default:
          return state;
        }
      }
    );
    const columnsGap = 4;
    const numberOfColumns = taskStatusEntries.length;
    const columnWidth = `calc(${100 / numberOfColumns}% - ${
      (columnsGap * (numberOfColumns - 1)) / numberOfColumns
    }px)`;
    
  async function handleCreateTask(data: any) {
    startTransition(() => {
      setOptimisticTasks( { type: "add", data: { task: data, subTasks: []}});
    })
    setTasksOrder((prev) => ({ ...prev, [data.status]: [...(prev[data.status] || []), data.uuid] }));
  }

  async function handleDeleteTask(taskUuid, taskStatus, subTasks) {
    startTransition(() => {
      setOptimisticTasks( { type: "delete", data: taskUuid});
    })
    setTasksOrder(prev => {
      const updatedStatusTasks = (prev[taskStatus] || []).filter(uuid => uuid !== taskUuid);
      return { ...prev, [taskStatus]: updatedStatusTasks };
    });

    for (const subTask of subTasks) {
      startTransition(() => {
        setOptimisticTasks( { type: "delete", data: subTask[0]});
      })
      setTasksOrder(prev => {
        const updatedStatusTasks = (prev[subTask[1]] || []).filter(uuid => uuid !== subTask[0]);
        return { ...prev, [subTask[1]]: updatedStatusTasks };
      });
    }

    try {
      await deleteTask(taskUuid);
    } catch (error) {
      const deletedTask = tasksWithSubTasks.find((t) => t.task.uuid === taskUuid);
      if (deletedTask) {
        startTransition(() => {
          setOptimisticTasks({ type: "add", data: deletedTask });
        })
        setTasksOrder(prev => {
          const updatedStatusTasks = [...(prev[taskStatus] || []), taskUuid];
          return { ...prev, [taskStatus]: updatedStatusTasks };
        });
      }
      toast.error("Une erreur est survenue");
    }
  }

  useEffect(() => {
    setTasksOrder(() => {
      const defaultTasksOrder: TasksOrder = {};

      taskStatusEntries.forEach((taskStatus) => {
        const [key, value] = taskStatus;

        defaultTasksOrder[value] = [];
      });

      const nextTasksOrder = { ...defaultTasksOrder, ...order };

      return nextTasksOrder;
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

    const targetList = [...(tasksOrder[destination.droppableId] || [])];
    let nextTaskColumns: TasksOrder = {};

    if (source.droppableId === destination.droppableId) {
      const [removed] = targetList.splice(source.index, 1);
      targetList.splice(destination.index, 0, removed);
      nextTaskColumns = {
        ...tasksOrder,
        [destination.droppableId]: targetList,
      };

      setTasksOrder(nextTaskColumns);
    } else {
      const sourceList = [...(tasksOrder[source.droppableId] || [])];
      const [removed] = sourceList.splice(source.index, 1);
      targetList.splice(destination.index, 0, removed);
      nextTaskColumns = {
        ...tasksOrder,
        [source.droppableId]: sourceList,
        [destination.droppableId]: targetList,
      };
      setTasksOrder(nextTaskColumns);
      updateTask({ status: destination.droppableId, uuid: draggableId }, false);
    }

    updateTasksOrder(nextTaskColumns, userId, false);
  }

  function getCurrentStatus(taskUuid: string) {
    const status = Object.keys(tasksOrder).find((status) =>
      tasksOrder[status]?.includes(taskUuid)
    );
    return status;
  }

   const taskMap = useMemo(() => {
    const map = new Map();
    optimisticTasks.forEach((t) => {
      map.set(t.task.uuid, t);
    });
    return map;
  }, [optimisticTasks]);

  return (
    <div
      style={{
        gap: columnsGap,
      }}
      className="flex flex-1"
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        {taskStatusEntries.map((taskStatus) => {
          const [key, value] = taskStatus;
          return (
            <div
              key={value}
              style={{
                width: columnWidth,
              }}
              className={cn(
                "border rounded-sm bg-stone-50 has-[:checked]:ring-blue-600 has-[:checked]:ring-2 has-[:checked]:border-transparent border-gray-300 flex flex-col"
              )}
            >
              <div className="p-4 min-h-[100px] sticky top-0 z-10 border-b-2 ">
                <div className="flex items-center gap-1 mb-2 text-sm">
                  <Squircle size={16} className="hidden sm:block" />
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
                      className="flex-1 p-1 sm:p-2"
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={snapshot.isDraggingOver}
                        readOnly
                      />
                      {tasksOrder[value]?.map((taskUuid, index) => {
                        if (taskUuid.startsWith("temp-")) {
                          const optimisticTask = taskMap.get(taskUuid);
                          if (!optimisticTask) return null;
                          if (optimisticTask) {
                            return (
                              <TaskCard
                                task={{
                                  task: optimisticTask.task,
                                  subTasks: []
                                }}
                                className="border-gray-300"
                                key={optimisticTask.task.uuid}
                              />
                            )
                          }
                        }

                        const taskItem = taskMap.get(taskUuid);
                        return taskItem ? (
                          <Draggable
                            key={taskItem.task.uuid}
                            draggableId={taskItem.task.uuid}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <TaskCard
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                task={{
                                  ...taskItem,
                                  task: {
                                    ...taskItem.task,
                                    status:
                                      getCurrentStatus(taskItem.task.uuid) ??
                                      taskItem.task.status,
                                  },
                                }}
                                className={cn(
                                  "",
                                  snapshot.isDragging
                                    ? " ring-blue-600 ring-2 border-transparent"
                                    : "border-gray-300"
                                )}
                                onDelete={handleDeleteTask}
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
      <TaskModal userId={userId} order={tasksOrder} onCreate={handleCreateTask}/>
    </div>
  );
}
