import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto, CreateUserDto, UpdateUserDto } from './dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getInfo/:id')
  getInfo(@Param('id') id: string) {
    return this.userService.getUserInfo(+id);
  }

  @Post('login')
  login(@Body() user: LoginDto) {
    return this.userService.login(user);
  }

  @Post('register')
  register(@Body() user: RegisterDto) {
    return this.userService.register(user);
  }
}
