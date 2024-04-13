import { Test, TestingModule } from '@nestjs/testing';
import { EditedMessageController } from './edited_message.controller';
import { RmqService } from '@app/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { ChatService } from '../chat/chat.service';
import { JoinedService } from '../joined/joined.service';
import { MentionedService } from '../mentioned/mentioned.service';
import { MessageService } from '../message/message.service';
import { RepliedService } from '../replied/replied.service';
import { UserService } from '../user/user.service';

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

describe('EditedMessageController', () => {
  let controller: EditedMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditedMessageController],
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

    controller = module.get<EditedMessageController>(EditedMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
