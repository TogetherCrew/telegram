import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Neo4jService } from 'nest-neo4j/dist';

class Neo4jServiceMock {}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
