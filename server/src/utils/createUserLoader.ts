import DataLoader from "dataloader";
import { User } from "../entities/User";

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userMap: Record<number, User> = {};
    users.forEach((u) => {
      userMap[u.id] = u;
    });

    return userIds.map((userId) => userMap[userId]);
  });
