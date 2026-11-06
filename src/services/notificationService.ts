import { AppNotification } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from './storageService';
import { SEED_NOTIFICATIONS } from '../data/reviews';

export function createSimulatedNotification(input: {
  userId: string;
  type: AppNotification['type'];
  title: string;
  message: string;
  linkTo?: string;
}): AppNotification {
  const existing = readStorage<AppNotification[]>(STORAGE_KEYS.notifications, SEED_NOTIFICATIONS);
  const created: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    read: false,
    createdAt: new Date().toISOString(),
    linkTo: input.linkTo,
  };
  writeStorage(STORAGE_KEYS.notifications, [created, ...existing]);
  return created;
}
