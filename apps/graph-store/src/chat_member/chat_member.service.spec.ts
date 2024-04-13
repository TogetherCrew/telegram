import { Test, TestingModule } from '@nestjs/testing';
import { ChatMemberService } from './chat_member.service';
import { Neo4jService } from 'nest-neo4j/dist';

class Neo4jServiceMock {}

describe('ChatMemberService', () => {
  let service: ChatMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatMemberService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    service = module.get<ChatMemberService>(ChatMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
