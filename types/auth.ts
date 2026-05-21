export type UserRole = "USER" | "BUSINESS" | "ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
};
