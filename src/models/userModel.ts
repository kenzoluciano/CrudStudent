export interface User {
  id: number;
  email: string;
  password: string; 
  role: "admin" | "user";
  created_at: Date;
}

export type UserInput = Omit<User, "id" | "created_at" | "role"> & {
  role?: "admin" | "user";
};

export type UserPublic = Omit<User, "password">;