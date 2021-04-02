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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject('AuthService') private authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'User has been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not an admin',
  })
  getMe(@User() user: UserWithID) {
    return user;
  }

  @ApiBearerAuth()
  @Get('all')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'All users have been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not an admin',
  })
  async getAll() {
    return (await this.userService.findAll()).map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    }));
  }

  @ApiBearerAuth()
  @Post('create')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiCreatedResponse({
    description: 'User has been created',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not an admin',
  })
  async create(@Body() user: UserDto) {
    const { id, role, username } = await this.userService.create({
      ...user,
    });

    return { id, role, username };
  }

  @ApiBearerAuth()
  @Delete('delete')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'User has been deleted',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not an admin',
  })
  async delete(@Param('id') id: string, @User('id') userId: string) {
    if (userId === id) {
      throw new BadRequestException({
        message: 'You cannot delete admin account',
      });
    }

    await this.userService.removeUser(id);

    return { success: true };
  }

  @ApiBearerAuth()
  @Get('id/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'User has been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not an admin',
  })
  async getByID(@Param('id') id: string) {
    const { id: userID, role, username } = await this.userService.findByID(id);

    return { id: userID, role, username };
  }

  @ApiBearerAuth()
  @Get('all/:skip')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'Users has been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not an admin',
  })
  async getPaginated(@Param('skip', ParseIntPipe) skip: number) {
    return (await this.userService.getPaginatedUsers(skip)).map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    }));
  }

  @Post('login')
  @ApiCreatedResponse({
    description: 'User has been logged in succesfully',
  })
  @ApiBadRequestResponse({
    description: 'Error occured during login in',
  })
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.userService.logUser(userLoginDto);
    const token = this.authService.signToken(user);

    return { user, token };
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'User has been registered succesfully',
  })
  @ApiBadRequestResponse({
    description: 'Error occured during registering, user already exists etc.',
  })
  async register(@Body() userLoginDto: UserLoginDto) {
    const { id, role, username } = await this.userService.create({
      ...userLoginDto,
      role: Role.User,
    });

    return { id, role, username };
  }
}
