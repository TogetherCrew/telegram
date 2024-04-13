import { Test, TestingModule } from '@nestjs/testing';
import { MessageReactionService } from './message_reaction.service';
import { Neo4jService } from 'nest-neo4j/dist';

class Neo4jServiceMock {}

describe('MessageReactionService', () => {
  let service: MessageReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageReactionService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    service = module.get<MessageReactionService>(MessageReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
