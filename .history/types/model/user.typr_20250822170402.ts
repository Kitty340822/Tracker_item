export interface IEmployee {
  user_id: string;
  name?: string;
  displayName: string;
  pin: string;
  refId?: string;
  isManager: boolean;
  image?: string;
  permissions?: string[];
}