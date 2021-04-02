import { Request } from 'express';
import { Role } from './../models/user.model';

export interface UserDto {
  username: string;
  password: string;
  role: Role;
}

export interface UserLoginDto {
  username: string;
  password: string;
}

export interface UserWithID {
  id: string;
  username: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: UserWithID;
}
