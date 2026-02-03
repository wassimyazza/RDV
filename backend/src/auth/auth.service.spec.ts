import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('test-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token on successful login', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = {
      id: '1',
      email: 'test@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'PARTICIPANT',
    };

    usersService.findByEmail.mockResolvedValue(user as any);

    const result = await service.login({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result).toHaveProperty('access_token');
    expect(result.access_token).toBe('test-token');
    expect(result.user.email).toBe('test@test.com');
  });

  it('should throw UnauthorizedException with wrong password', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = {
      id: '1',
      email: 'test@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'PARTICIPANT',
    };

    usersService.findByEmail.mockResolvedValue(user as any);

    await expect(
      service.login({
        email: 'test@test.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
