import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  save: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
});

describe('CreateUserProvider', () => {
  let service: CreateUserProvider;
  let usersRepository: MockRepository<UserEntity>;
  const user = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@test.org',
    password: 'password',
    posts: [],
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMockRepository(),
        },
        {
          provide: HashingProvider,
          useValue: {
            hashPassword: jest.fn(() => Promise.resolve(user.password)),
            comparePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toBeDefined();
    });

    describe('When user does not exist', () => {
      it('should create a new user', async () => {
        usersRepository.findOne?.mockReturnValue(null);
        usersRepository.create?.mockReturnValue(user);
        usersRepository.save?.mockReturnValue(user);
        const newUser = await service.create(user);

        expect(newUser).toEqual(user);
        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: { email: user.email },
        });
        expect(usersRepository.create).toHaveBeenCalledWith(user);
        expect(usersRepository.save).toHaveBeenCalledWith(user);
      });
    });
    describe('when user already exists', () => {
      it('should throw a BadRequestException', async () => {
        usersRepository.findOne?.mockReturnValue(user);
        usersRepository.create?.mockReturnValue(user);
        usersRepository.save?.mockReturnValue(user);

        await expect(service.create(user)).rejects.toThrow(BadRequestException);
      });
    });
  });
});
