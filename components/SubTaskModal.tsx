"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { taskFormBaseSchema, TaskFormBaseSchema } from "@/lib/zod-validations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useTaskModal } from "@/hooks/useTaskModal";
import { v4 as uuidv4 } from "uuid";

export default function SubTaskModal({
  onSubTaskCreate,
  onSubTaskUpdate,
}: {
  onSubTaskCreate: (t: TaskFormBaseSchema) => void;
  onSubTaskUpdate: (t: TaskFormBaseSchema) => void;
}) {
  const { closeSubTaskModal, editedSubTask, isSubTaskModalOpen } =
    useTaskModal();

  const form = useForm<TaskFormBaseSchema>({
    resolver: zodResolver(taskFormBaseSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "backlog",
    },
  });

  useEffect(() => {
    if (editedSubTask) {
      form.setValue("name", editedSubTask.name);
      form.setValue("description", editedSubTask.description);
      form.setValue("status", editedSubTask.status);
      form.setValue("uuid", editedSubTask.uuid);
    } else {
      form.reset();
      const tempUuid = "temp-" +  uuidv4();
      form.setValue("uuid", tempUuid); // set a temporary UUID for new sub-tasks
    }
  }, [form, editedSubTask, isSubTaskModalOpen]);

  async function onSubmit(data: TaskFormBaseSchema) {
    if (editedSubTask) {
      onSubTaskUpdate(data);
    } else {
      onSubTaskCreate(data);
    }
    form.reset();
    closeSubTaskModal();
  }

  return (
    <Dialog open={isSubTaskModalOpen} onOpenChange={closeSubTaskModal}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {!editedSubTask
                  ? "Nouvelle sous-tâche"
                  : "Éditer la sous-tâche"}
              </DialogTitle>
              <DialogClose className="test-red-500" />
              <DialogDescription>
                Cette tâche est une sous-tâche de la tâche parente créée/éditée
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block mb-1">Titre</FormLabel>
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
                    <FormLabel className="block mb-1">Statut</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeSubTaskModal}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty}>
                {!editedSubTask ? "Créer" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
