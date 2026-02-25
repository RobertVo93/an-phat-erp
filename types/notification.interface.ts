import { IBase, IBaseFilters } from "./base.interface";
import { NotificationType } from "./enums";
import { IUser } from "./user";

export interface INotification extends IBase {
  type?: NotificationType;
  title?: string;
  content?: string;
  data?: Record<string, any>;
  url?: string
  isRead?: boolean;
  readAt?: Date;
  user?: IUser;
  userId?: string
  deduplicationKey?: string | null;
}

export interface INotificationFilter extends IBaseFilters{
  userId?: string
  limit?: number
  offset?: number
}