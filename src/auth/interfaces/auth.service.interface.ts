import type { Request, Response } from 'express';
import type { LoginDto } from '../dto/login.dto';
import type { RegisterDto } from '../dto/register.dto';
import type { UserResponseDto } from '../../users/dto/user-response.dto';

export interface IAuthService {
  register(dto: RegisterDto, response: Response): Promise<{ accessToken: string; user: UserResponseDto }>;
  login(dto: LoginDto, response: Response): Promise<{ accessToken: string; user: UserResponseDto }>;
  refresh(request: Request, response: Response): Promise<{ accessToken: string; user: UserResponseDto }>;
}
