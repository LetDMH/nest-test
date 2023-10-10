import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  selectUserById(userId: number): Promise<User | undefined> {
    console.log(userId);

    return this.findOne({
      select: ['username'],
      where: [{ id: userId }],
    });
  }
}
