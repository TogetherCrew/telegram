import { Test, TestingModule } from '@nestjs/testing';
import { MessageReactionController } from './message_reaction.controller';
import { RmqService } from '@app/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { ChatService } from '../chat/chat.service';
import { JoinedService } from '../joined/joined.service';
import { UserService } from '../user/user.service';
import { MessageReactionService } from './message_reaction.service';

// Mock RmqService
class RmqServiceMock {
  ack = jest.fn();
}

class Neo4jServiceMock {}
class MessageReactionServiceMock {}
class ChatServiceMock {}
class UserServiceMock {}
class JoinedServiceMock {}

describe('MessageReactionController', () => {
  let controller: MessageReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageReactionController],
      providers: [
        { provide: Neo4jService, useClass: Neo4jServiceMock },
        {
          provide: MessageReactionService,
          useClass: MessageReactionServiceMock,
        },
        { provide: ChatService, useClass: ChatServiceMock },
        { provide: UserService, useClass: UserServiceMock },
        { provide: JoinedService, useClass: JoinedServiceMock },
        { provide: RmqService, useClass: RmqServiceMock },
      ],
    }).compile();

    controller = module.get<MessageReactionController>(
      MessageReactionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
