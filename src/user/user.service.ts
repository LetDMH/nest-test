import { Injectable } from '@nestjs/common';
import { User } from './entities';
// import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, RegisterDto, CreateUserDto, UpdateUserDto } from './dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  // @InjectRepository(User)
  private readonly userRepo: UserRepository;

  getUserInfo(userId: number) {
    return this.userRepo.selectUserById(userId);
  }

  login(user: LoginDto) {
    return user;
  }

  register(user: RegisterDto) {
    return user;
  }
}
