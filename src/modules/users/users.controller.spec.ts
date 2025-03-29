import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.enums';
import { ApiResponse } from './types/response.type';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: jest.Mocked<UsersService>;

  const mockUser: User = {
    id: '1a2b3c4d',
    full_name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword123',
    role: UserRole.ADMIN,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    // Mock UsersService
    const mockService = {
      createUser: jest.fn(),
      findAllUsers: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    mockUsersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return the response', async () => {
      const createUserDto: CreateUserDto = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };
      const response: ApiResponse<User> = {
        message: 'User created successfully',
        data: mockUser,
      };

      mockUsersService.createUser.mockResolvedValue(response);

      const result = await controller.createUser(createUserDto);
      expect(result).toEqual(response);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const response: ApiResponse<User[]> = {
        message: 'Users retrieved successfully',
        data: [mockUser],
      };

      mockUsersService.findAllUsers.mockResolvedValue(response);

      const result = await controller.findAllUsers();
      expect(result).toEqual(response);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUsersService.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const response: ApiResponse<User> = {
        message: 'User retrieved successfully',
        data: mockUser,
      };

      mockUsersService.findUserById.mockResolvedValue(response);

      const result = await controller.findUserById('1a2b3c4d');
      expect(result).toEqual(response);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUsersService.findUserById).toHaveBeenCalledWith('1a2b3c4d');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.findUserById.mockRejectedValue(
        new NotFoundException('User with ID nonexistent not found'),
      );

      await expect(controller.findUserById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUsersService.findUserById).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the response', async () => {
      const updateUserDto: UpdateUserDto = { full_name: 'Jane Doe' };
      const response: ApiResponse<User> = {
        message: 'User updated successfully',
        data: { ...mockUser, full_name: 'Jane Doe' },
      };

      mockUsersService.updateUser.mockResolvedValue(response);

      const result = await controller.updateUser('1a2b3c4d', updateUserDto);
      expect(result).toEqual(response);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(
        '1a2b3c4d',
        updateUserDto,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto: UpdateUserDto = { full_name: 'Jane Doe' };
      mockUsersService.updateUser.mockRejectedValue(
        new NotFoundException('User with ID nonexistent not found'),
      );

      await expect(
        controller.updateUser('nonexistent', updateUserDto),
      ).rejects.toThrow(NotFoundException);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(
        'nonexistent',
        updateUserDto,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return the response', async () => {
      const response: ApiResponse<boolean> = {
        message: 'User deleted successfully',
        data: true,
      };

      mockUsersService.deleteUser.mockResolvedValue(response);

      const result = await controller.deleteUser('1a2b3c4d');
      expect(result).toEqual(response);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith('1a2b3c4d');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.deleteUser.mockRejectedValue(
        new NotFoundException('User with ID nonexistent not found'),
      );

      await expect(controller.deleteUser('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith('nonexistent');
    });
  });
});
