import { BaseRepository } from './base.repository';
import { User } from '../models/user.model';

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  findByEmail(email: string) {
    return this.model.findOne({ where: { email } });
  }
}

export const userRepository = new UserRepository();



