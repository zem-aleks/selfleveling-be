import { UserEntity } from '../types/entity';
import { User } from '../entities/user.entity';

export const mapToEntity = (user: User): UserEntity => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { authId, ...publicData } = user;
  return { ...publicData };
};
