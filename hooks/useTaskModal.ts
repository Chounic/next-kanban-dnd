import { Task } from "@/database/kysely";
import { TaskFormBaseSchema } from "@/lib/zod-validations";
import { create } from "zustand";

type TaskModalStore = {
  isOpen: boolean;
  task?: Task;
  openModal: (task?: Task, subTasks?: Task[]) => void;
  closeModal: () => void;
  subTasks: Task[];
  editedSubTask?: TaskFormBaseSchema;
  isSubTaskModalOpen: boolean;
  openSubTaskModal: (subTask?: TaskFormBaseSchema) => void;
  closeSubTaskModal: () => void;
};

export const useTaskModal = create<TaskModalStore>((set) => ({
  isOpen: false,
  openModal: (task, subTasks) => set({ isOpen: true, task, subTasks }),
  closeModal: () => set({ isOpen: false, task: undefined, subTasks: [] }),
  subTasks: [],
  isSubTaskModalOpen: false,
  openSubTaskModal: (subTask) =>
    set({ isSubTaskModalOpen: true, editedSubTask: subTask }),
  closeSubTaskModal: () =>
    set({ isSubTaskModalOpen: false, editedSubTask: undefined }),
}));
