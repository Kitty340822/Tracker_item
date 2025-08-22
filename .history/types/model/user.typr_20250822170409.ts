export interface IEmployee {
  user_id: string;
  name?: string;
  refId?: string;
  isManager: boolean;
  image?: string;
  permissions?: string[];
}