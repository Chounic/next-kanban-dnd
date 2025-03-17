"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTaskModal } from "@/hooks/useTaskModal";
import { createTask, updateTask } from "@/action/tasks-server";
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
import { TaskFormSchema, taskFormSchema } from "@/lib/zod-validations";

export default function TaskModal({ userId }: { userId: string }) {
  const { isOpen, closeModal, task } = useTaskModal();
  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "backlog",
    },
  });

  useEffect(() => {
    if (task) {
      form.setValue("name", task.name);
      form.setValue("description", task.description);
      form.setValue("status", task.status);
    } else {
      form.reset();
    }
  }, [task, form]);

  async function onSubmit(data: TaskFormSchema) {
    if (task) {
      // Update existing task
      await updateTask({ ...data, id: task.id });
    } else {
      // Create new task
      await createTask({ ...data, userId });
    }
    form.reset();
    closeModal();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {task ? "Edit Task" : "Create Task"}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="block mb-1">Task Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full p-2 border rounded" />
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
                  <FormLabel className="block mb-1">Description</FormLabel>
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="block mb-1">Status</FormLabel>
                  <FormControl>
                    {/* problem with the shadcn component Select value not displaying, i used classic select */}
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
              >
                {task ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
