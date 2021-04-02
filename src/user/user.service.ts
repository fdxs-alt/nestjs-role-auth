import { UserDto, UserLoginDto } from './user.dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.model';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private user: Repository<UserEntity>,
  ) {}

  findByID(id: string) {
    return this.user.findOne({ where: { id } });
  }

  findAll() {
    return this.user.find();
  }

  async create({ password, role, username }: UserDto) {
    const isAlreadyInDb = await this.findByName(username);

    if (isAlreadyInDb) {
      throw new BadRequestException({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    return this.user.save({
      username,
      role,
      hashedPassword,
    });
  }

  async logUser({ password, username: name }: UserLoginDto) {
    const user = await this.findByName(name);

    if (!user) {
      throw new BadRequestException({ message: 'User does not exist' });
    }

    const { hashedPassword, id, role, username } = user;

    const isAuth = await compare(password, hashedPassword);

    if (!isAuth) {
      throw new UnauthorizedException({ message: 'User unauthorized' });
    }

    return { id, role, username };
  }

  getPaginatedUsers(skip: number) {
    return this.user.find({ skip, take: 10 });
  }

  removeUser(id: string) {
    return this.user.delete({ id });
  }

  findByName(username: string) {
    return this.user.findOne({ where: { username } });
  }
}
