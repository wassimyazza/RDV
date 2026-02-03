import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
    let service: UsersService;
    let mockRepository;

    beforeEach(async () => {
        mockRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user with hashed password', async () => {
        const userDto = {
            email: 'test@test.com',
            password: '123456',
            firstName: 'Test',
            lastName: 'User',
            role: 'PARTICIPANT' as any,
        };

        mockRepository.findOne.mockResolvedValue(null);
        mockRepository.create.mockReturnValue(userDto);
        mockRepository.save.mockResolvedValue({ id: '1', ...userDto });

        const result = await service.create(userDto);

        expect(result).toBeDefined();
        expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should find a user by email', async () => {
        const user = {
            id: '1',
            email: 'test@test.com',
            firstName: 'Test',
            lastName: 'User',
        };

        mockRepository.findOne.mockResolvedValue(user);

        const result = await service.findByEmail('test@test.com');

        expect(result).toEqual(user);
        expect(mockRepository.findOne).toHaveBeenCalledWith({
            where: { email: 'test@test.com' },
        });
    });
});
