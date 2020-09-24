import DataLoader from "dataloader";

import { Updoot } from "../entities/Updoot";

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootMap: Record<string, Updoot> = {};
      updoots.forEach((ud) => {
        updootMap[`${ud.userId}|${ud.postId}`] = ud;
      });
      return keys.map((key) => updootMap[`${key.userId}|${key.postId}`]);
    }
  );
