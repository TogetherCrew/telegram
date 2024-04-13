import { Test, TestingModule } from '@nestjs/testing';
import { JoinedService } from './joined.service';
import { Neo4jService } from 'nest-neo4j/dist';

class Neo4jServiceMock {}

describe('JoinedService', () => {
  let service: JoinedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JoinedService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    service = module.get<JoinedService>(JoinedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
