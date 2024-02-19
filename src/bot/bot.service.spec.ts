import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from './bot.service';
import { Neo4jService } from 'nest-neo4j/dist';

describe('BotService', () => {
  let service: BotService;
  let mockNeo4jService: jest.Mocked<Neo4jService>;

  beforeEach(async () => {
    mockNeo4jService = {
      write: jest.fn(),
    } as unknown as jest.Mocked<Neo4jService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
      ],
    }).compile();

    service = module.get<BotService>(BotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
