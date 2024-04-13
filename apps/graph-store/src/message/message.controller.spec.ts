import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { RmqService } from '@app/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { ChatService } from '../chat/chat.service';
import { JoinedService } from '../joined/joined.service';
import { MentionedService } from '../mentioned/mentioned.service';
import { RepliedService } from '../replied/replied.service';
import { UserService } from '../user/user.service';
import { MessageService } from './message.service';

// Mock RmqService
class RmqServiceMock {
  ack = jest.fn();
}

class Neo4jServiceMock {}
class MessageServiceMock {}
class ChatServiceMock {}
class UserServiceMock {}
class JoinedServiceMock {}
class RepliedServiceMock {}
class MentionedServiceMock {}

describe('MessageController', () => {
  let controller: MessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        { provide: Neo4jService, useClass: Neo4jServiceMock },
        { provide: MessageService, useClass: MessageServiceMock },
        { provide: ChatService, useClass: ChatServiceMock },
        { provide: UserService, useClass: UserServiceMock },
        { provide: JoinedService, useClass: JoinedServiceMock },
        { provide: RepliedService, useClass: RepliedServiceMock },
        { provide: MentionedService, useClass: MentionedServiceMock },
        { provide: RmqService, useClass: RmqServiceMock },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
