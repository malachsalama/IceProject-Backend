import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { ApiTags } from '@nestjs/swagger';
import { LoginDocs } from './docs/login.docs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(201)
  @LoginDocs.login()
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponse<{ access_token: string }>> {
    return this.authService.login(loginDto);
  }
}
