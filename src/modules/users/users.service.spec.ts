import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: '1a2b3c4d',
  full_name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'hashedPassword123',
  role: UserRole.ADMIN,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateUserDto) => ({
              ...dto,
              id: '1a2b3c4d',
              created_at: new Date(),
              updated_at: new Date(),
            })),
            save: jest
              .fn()
              .mockImplementation((user) =>
                Promise.resolve({ ...mockUser, ...user }),
              ),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));

    // Mock bcrypt
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123' as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test createUser
  describe('createUser', () => {
    it('should create a user with hashed password and return structured response', async () => {
      const createUserDto: CreateUserDto = {
        full_name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };

      const result = await service.createUser(createUserDto);

      expect(result).toEqual({
        message: 'User created successfully',
        data: expect.objectContaining({
          full_name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'hashedPassword123', // Expect hashed password
          role: UserRole.ADMIN,
        }),
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword123', // Hashed by bcrypt
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createUserDto,
          password: 'hashedPassword123',
        }),
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
    });
  });

  // Test findAllUsers
  describe('findAllUsers', () => {
    it('should return an array of users with success message', async () => {
      const result = await service.findAllUsers();
      expect(result).toEqual({
        message: 'Users retrieved successfully',
        data: [mockUser],
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return empty array with no-users message', async () => {
      repository.find.mockResolvedValueOnce([]);
      const result = await service.findAllUsers();
      expect(result).toEqual({
        message: 'No users found',
        data: [],
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalled();
    });
  });

  // Test findUserById
  describe('findUserById', () => {
    it('should return a user with success message', async () => {
      const result = await service.findUserById('1a2b3c4d');
      expect(result).toEqual({
        message: 'User retrieved successfully',
        data: mockUser,
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.findUserById('nonexistent')).rejects.toThrow(
        new NotFoundException(`User with ID nonexistent not found`),
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  // Test updateUser
  describe('updateUser', () => {
    it('should update and return the updated user with success message', async () => {
      const updateUserDto: UpdateUserDto = { full_name: 'Jane Doe' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      repository.findOne.mockResolvedValueOnce(mockUser);
      repository.save.mockResolvedValueOnce(updatedUser);

      const result = await service.updateUser('1a2b3c4d', updateUserDto);

      expect(result).toEqual({
        message: 'User updated successfully',
        data: updatedUser,
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should hash password if provided and update the user', async () => {
      const updateUserDto: UpdateUserDto = { password: 'newpassword123' };
      const updatedUser = { ...mockUser, password: 'hashedPassword123' };

      repository.findOne.mockResolvedValueOnce(mockUser);
      repository.save.mockResolvedValueOnce(updatedUser);

      const result = await service.updateUser('1a2b3c4d', updateUserDto);

      expect(result).toEqual({
        message: 'User updated successfully',
        data: updatedUser,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 'salt');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashedPassword123' }),
      );
    });

    it('should throw NotFoundException when updating a non-existent user', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      const updateUserDto: UpdateUserDto = { full_name: 'Jane Doe' };

      await expect(
        service.updateUser('nonexistent', updateUserDto),
      ).rejects.toThrow(
        new NotFoundException(`User with ID nonexistent not found`),
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  // Test deleteUser
  describe('deleteUser', () => {
    it('should delete a user and return success message', async () => {
      const result = await service.deleteUser('1a2b3c4d');
      expect(result).toEqual({
        message: 'User deleted successfully',
        data: true,
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.delete).toHaveBeenCalledWith('1a2b3c4d');
    });

    it('should throw NotFoundException when deleting a non-existent user', async () => {
      repository.delete.mockResolvedValueOnce({ affected: 0, raw: [] });
      await expect(service.deleteUser('nonexistent')).rejects.toThrow(
        new NotFoundException(`User with ID nonexistent not found`),
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.delete).toHaveBeenCalledWith('nonexistent');
    });
  });
});
