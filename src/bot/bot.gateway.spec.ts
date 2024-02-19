import { Test, TestingModule } from '@nestjs/testing';
import { BotGateway } from './bot.gateway';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { Neo4jService } from 'nest-neo4j/dist';

describe('BotGateway', () => {
  let gateway: BotGateway;
  let mockNeo4jService: jest.Mocked<Neo4jService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BotGateway,
        BotService,
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
      ],
    }).compile();

    gateway = module.get<BotGateway>(BotGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
