import { Request } from 'express';
import { Role } from './../models/user.model';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: ['admin', 'user'] })
  role: Role;
}

export class UserLoginDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class UserWithID {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;
}

export interface RequestWithUser extends Request {
  user: UserWithID;
}
