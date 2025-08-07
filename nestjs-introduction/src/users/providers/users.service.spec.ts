import { Test, TestingModule } from '@nestjs/testing';

import { CreateGoogleUserProvider } from './create-google-user.provider';
import { CreateUserProvider } from './create-user.provider';
import { DataSource } from 'typeorm';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser = {
    id: 'test',
    firstName: 'test',
    lastName: 'test',
    email: 'test@test.net',
    password: 'test',
    posts: [],
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };
  const mockCreateUserProvider: Partial<CreateUserProvider> = {
    create: jest.fn(() => Promise.resolve(mockUser)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: CreateUserProvider, useValue: mockCreateUserProvider },
        { provide: UsersCreateManyProvider, useValue: {} },
        { provide: FindOneUserByEmailProvider, useValue: {} },
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: CreateGoogleUserProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toBeDefined();
    });

    it('should create a user', async () => {
      const user = await service.create(mockUser);
      expect(mockCreateUserProvider.create).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });
  });
});
