import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';

@Global()
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
