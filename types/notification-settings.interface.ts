import { IBase } from "./base.interface";
import { IUser } from "./user";

export interface INotificationSettings extends IBase {
  user?: IUser

  // notification types
  orderEnabled?: boolean
  promotionEnabled?: boolean

  // display channels
  inappEnabled?: boolean
  emailEnabled?: boolean
  smsEnabled?: boolean

  muteUntil?: Date
}
