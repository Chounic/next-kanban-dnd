import { Task } from "@/lib/kysely";
import { create } from "zustand";

type TaskModalStore = {
  isOpen: boolean;
  task: Task | null;
  openModal: (task?: Task) => void;
  closeModal: () => void;
};

export const useTaskModal = create<TaskModalStore>((set) => ({
  isOpen: false,
  task: null,
  openModal: (task) => set({ isOpen: true, task }),
  closeModal: () => set({ isOpen: false, task: null }),
}));
