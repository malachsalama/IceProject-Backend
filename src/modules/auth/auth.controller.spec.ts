import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from '../../shared/types/response.type';

describe('AuthController', () => {
  let controller: AuthController;

  const mockLoginDto: LoginDto = {
    email: 'john@example.com',
    password: 'password123',
  };

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call AuthService.login and return the access token', async () => {
      // Arrange
      const mockResponse: ApiResponse<{ access_token: string }> = {
        message: 'Login successful',
        data: { access_token: 'mock-jwt-token' },
      };
      mockAuthService.login.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.login(mockLoginDto);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from AuthService', async () => {
      // Arrange
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(mockLoginDto)).rejects.toThrow(error);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });
});
