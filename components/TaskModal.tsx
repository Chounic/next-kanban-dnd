"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTaskModal } from "@/hooks/useTaskModal";
import { createTask, deleteTask, updateTask } from "@/action/tasks-server";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  TaskFormBaseSchema,
  TaskFormSchema,
  taskFormSchema,
} from "@/lib/zod-validations";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Check,
  CircleX,
  Pencil,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Checkbox } from "./ui/checkbox";
import SubTaskModal from "./SubTaskModal";
import { CreateTask, Task, UpdateTask } from "@/database/kysely";

const availableLabels = [
  "bug",
  "feature",
  "documentation",
  "enhancement",
  "design",
  "testing",
];

export default function TaskModal({ userId }: { userId: string }) {
  const { isOpen, closeModal, task, subTasks, openSubTaskModal } =
    useTaskModal();
  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "backlog",
      priority: "medium",
      labels: [],
      archived: false,
    },
  });

  const [openDueDatePopover, setOpenDueDatePopover] = useState(false);
  const [openLabelsPopover, setOpenLabelsPopover] = useState(false);
  const [subTaskList, setSubTaskList] = useState<(TaskFormBaseSchema | Task)[]>(
    []
  );

  useEffect(() => {
    if (task) {
      form.setValue("name", task.name);
      form.setValue("description", task.description);
      form.setValue("status", task.status);
      form.setValue("priority", task.priority);
      form.setValue("dueDate", task.dueDate);
      form.setValue("estimatedTime", task.estimatedTime);
      form.setValue("labels", task.labels);
      form.setValue("archived", task.archived || false);
    } else {
      form.reset();
    }
    setSubTaskList(subTasks);
  }, [form, task /* isOpen */]);

  async function onSubmit(data: TaskFormSchema) {
    if (task) {
      await updateTask({ ...data, uuid: task.uuid });
      for (const subTaskListItem of subTaskList) {
        if ("id" in subTaskListItem) {
          await updateTask(subTaskListItem as UpdateTask);
        } else {
          await createTask({
            ...(subTaskListItem as CreateTask),
            userId,
            parentTaskId: task.id,
          });
        }
      }

      for (const subTask of subTasks) {
        if (!subTaskList.map((st) => st.uuid).includes(subTask.uuid)) {
          await deleteTask(subTask.uuid);
        }
      }
    } else {
      const newTask = await createTask({ ...data, userId });
      for (const subTask of subTaskList as CreateTask[]) {
        await createTask({
          ...subTask,
          userId,
          parentTaskId: newTask?.id,
        });
      }
    }
    form.reset();
    closeModal();
  }

  function addSubTask(data: TaskFormBaseSchema) {
    setSubTaskList((prev) => [...prev, data]);
  }

  function updateSubTask(data: TaskFormBaseSchema) {
    setSubTaskList((prev) =>
      prev.map((subTask) =>
        subTask.uuid === data.uuid ? { ...subTask, ...data } : subTask
      )
    );
  }

  function deleteSubtask(uuid: string) {
    setSubTaskList((prev) => [...prev].filter((t) => t.uuid !== uuid));
  }

  function toggleLabel(label: string) {
    const currentLabels = form.getValues("labels");
    if (currentLabels.includes(label)) {
      form.setValue(
        "labels",
        currentLabels.filter((l) => l !== label)
      );
    } else {
      form.setValue("labels", [...currentLabels, label]);
    }
  }

  function removeLabel(label: string) {
    const currentLabels = form.getValues("labels");
    form.setValue(
      "labels",
      currentLabels.filter((l) => l !== label)
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">
              {task ? "Edit Task" : "Create Task"}
            </h2>
            <Button
              variant="ghost"
              className="hover:bg-transparent"
              onClick={closeModal}
            >
              <CircleX />
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row">
                {/* Main content - left side */}
                <div className="flex-1 p-6 border-r">
                  <div className="mb-4">
                    <h2>Create New Task</h2>
                    <p>Fill in the details to create a new task.</p>
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="block mb-1">
                            Task Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full p-2 border rounded"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="block mb-1">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full p-2 border rounded"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Properties - right side */}
                <div className="w-full md:w-[300px] p-6 space-y-4 bg-muted/20">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Task Properties
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="block mb-1">Statut</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full p-2 border rounded"
                              onChange={(e) => field.onChange(e.target.value)}
                              value={field.value}
                            >
                              <option value="backlog">Backlog</option>
                              <option value="ready">Ready</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="block mb-1">
                            Importance
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full p-2 border rounded"
                              onChange={(e) => field.onChange(e.target.value)}
                              value={field.value}
                            >
                              <option value="low">Basse</option>
                              <option value="medium">Medium</option>
                              <option value="high">Haute</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Echéance</FormLabel>
                          <Popover
                            open={openDueDatePopover}
                            onOpenChange={setOpenDueDatePopover}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal flex justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  <>
                                    <span>{format(field.value, "PPP")}</span>
                                    <div
                                      onClick={(e) => (
                                        e.stopPropagation(),
                                        form.resetField("dueDate")
                                      )}
                                    >
                                      <CircleX className="h-4 w-4" />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span>Pick a date</span>
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setOpenDueDatePopover(false);
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                defaultMonth={field.value ?? new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedTime"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block mb-1">
                          Estimated Time (days)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full p-2 border rounded"
                            type="number"
                            min={0}
                            step={1}
                            value={field.value ?? ""}
                            placeholder="Enter days"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full text-xs h-8"
                      onClick={(e) => {
                        e.preventDefault();
                        openSubTaskModal();
                      }}
                    >
                      Create Subtask
                    </Button>
                  </div>
                  {subTaskList.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium mb-2">Subtasks</h4>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {subTaskList.map((subTask, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-background rounded-md border p-2 text-xs"
                          >
                            <span className="truncate flex-1">
                              {subTask.name}
                            </span>
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.preventDefault();
                                  openSubTaskModal(subTask);
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteSubtask(subTask.uuid!); //TODO fix Tasks Type Attribution
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="labels"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormControl>
                          <Popover
                            open={openLabelsPopover}
                            onOpenChange={setOpenLabelsPopover}
                            {...field}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between text-xs h-8"
                              >
                                <span>Labels</span>
                                <span>
                                  <Settings />
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search labels..." />
                                <CommandList>
                                  <CommandEmpty>No label found.</CommandEmpty>
                                  <CommandGroup>
                                    {availableLabels.map((label) => (
                                      <CommandItem
                                        key={label}
                                        value={label}
                                        onSelect={toggleLabel}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value.includes(label)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {field.value.map((label) => (
                              <Badge
                                key={label}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {label}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => removeLabel(label)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="archived"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            id="archived"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="archived"
                          className="text-xs font-medium"
                        >
                          Archive this task
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => console.log("on click !!", form)}
                >
                  {task ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <SubTaskModal
        onSubTaskCreate={addSubTask}
        onSubTaskUpdate={updateSubTask}
      />
    </>
  );
}
