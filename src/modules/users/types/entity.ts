export type UserEntity = {
  id: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  linkedIn?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
};
