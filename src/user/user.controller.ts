import { RolesGuard } from './../guards/roles.guard';
import { AuthGuard } from './../guards/auth.guard';
import { AuthService } from './../auth/auth.service';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserDto, UserLoginDto, UserWithID } from './user.dto';
import { User } from './user.decorator';
import { Role } from '../models/user.model';
import { Roles } from './roles.decorator';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject('AuthService') private authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@User() user: UserWithID) {
    return user;
  }

  @Get('all')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getAll() {
    return (await this.userService.findAll()).map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    }));
  }

  @Post('create')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() user: UserDto) {
    const { id, role, username } = await this.userService.create({
      ...user,
    });

    return { id, role, username };
  }

  @Delete('delete')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param('id') id: string, @User('id') userId: string) {
    if (userId === id) {
      throw new BadRequestException({
        message: 'You cannot delete admin account',
      });
    }

    await this.userService.removeUser(id);

    return { success: true };
  }

  @Get('id/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getByID(@Param('id') id: string) {
    const { id: userID, role, username } = await this.userService.findByID(id);

    return { id: userID, role, username };
  }

  @Get('all/:skip')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getPaginated(@Param('skip', ParseIntPipe) skip: number) {
    return (await this.userService.getPaginatedUsers(skip)).map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    }));
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.userService.logUser(userLoginDto);
    const token = this.authService.signToken(user);

    return { user, token };
  }
}
