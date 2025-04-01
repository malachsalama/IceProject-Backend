import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let bcryptCompareSpy: jest.SpyInstance;

  const mockUser = {
    id: '1a2b3c4d',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: 'admin',
    full_name: 'John Doe',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockLoginDto: LoginDto = {
    email: 'john@example.com',
    password: 'password123',
  };

  const mockUsersService = {
    findUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Clear mocks and set up bcrypt spy
    jest.clearAllMocks();
    bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');
  });

  afterEach(() => {
    bcryptCompareSpy.mockRestore();
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      // Arrange
      mockUsersService.findUserByEmail.mockResolvedValue({
        message: 'User retrieved successfully',
        data: mockUser,
      });
      bcryptCompareSpy.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');

      // Act
      const result = await service.login(mockLoginDto);

      // Assert
      expect(result).toEqual({
        message: 'Login successful',
        data: { access_token: 'mock-jwt-token' },
      });
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        mockLoginDto.email,
      );
      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      // Arrange
      const invalidLoginDto: LoginDto = {
        ...mockLoginDto,
        email: 'invalid@example.com',
      };
      mockUsersService.findUserByEmail.mockResolvedValue({
        message: 'User not found',
        data: null,
      });

      // Act & Assert
      await expect(service.login(invalidLoginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        invalidLoginDto.email,
      );
      expect(bcryptCompareSpy).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      // Arrange
      const invalidLoginDto: LoginDto = {
        ...mockLoginDto,
        password: 'wrongpassword',
      };
      mockUsersService.findUserByEmail.mockResolvedValue({
        message: 'User retrieved successfully',
        data: mockUser,
      });
      bcryptCompareSpy.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(invalidLoginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        invalidLoginDto.email,
      );
      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        invalidLoginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
