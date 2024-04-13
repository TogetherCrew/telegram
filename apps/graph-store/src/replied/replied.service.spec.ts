import { Test, TestingModule } from '@nestjs/testing';
import { RepliedService } from './replied.service';
import { Neo4jService } from 'nest-neo4j/dist';

class Neo4jServiceMock {}

describe('RepliedService', () => {
  let service: RepliedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepliedService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    service = module.get<RepliedService>(RepliedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
