import create, { State } from "zustand";
import produce from "immer";

// Define a type for the notification:
type Notification = {
  type: 'success' | 'error' | 'info';
  message: string;
  description?: string;
  txid?: string;
};

// Use this type instead of 'any':
interface NotificationStore extends State {
  notifications: Notification[];
  set: (fn: (state: NotificationStore) => NotificationStore) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  set: (fn) => set(produce(fn)),
}));

export default useNotificationStore;
