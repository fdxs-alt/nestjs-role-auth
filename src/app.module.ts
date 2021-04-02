import { UserEntity } from './models/user.model';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [UserEntity],
      keepConnectionAlive: true,
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
