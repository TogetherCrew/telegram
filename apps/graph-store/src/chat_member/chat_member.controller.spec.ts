import { Test, TestingModule } from '@nestjs/testing';
import { ChatMemberController } from './chat_member.controller';
import { RmqService } from '@app/common';
import { ChatMemberService } from './chat_member.service';
import { Neo4jService } from 'nest-neo4j/dist';

// Mock RmqService
class RmqServiceMock {
  ack = jest.fn();
}

class Neo4jServiceMock {}

describe('ChatMemberController', () => {
  let controller: ChatMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMemberController],
      providers: [
        ChatMemberService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
        { provide: RmqService, useClass: RmqServiceMock },
      ],
    }).compile();

    controller = module.get<ChatMemberController>(ChatMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
