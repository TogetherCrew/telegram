import { Test, TestingModule } from '@nestjs/testing';
import { MentionedService } from './mentioned.service';
import { Neo4jService } from 'nest-neo4j/dist';

class Neo4jServiceMock {}

describe('MentionedService', () => {
  let service: MentionedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentionedService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    service = module.get<MentionedService>(MentionedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
