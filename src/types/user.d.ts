export interface IUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: "BASIC" | "AGENT" | "ADMIN";
  adminRole: "STAFF" | "ADMIN";
  emailVerified: boolean;
  createdAt: Date;
}
