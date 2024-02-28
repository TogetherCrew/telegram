// events.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreController } from './event-store.controller';
import { EventStoreService } from './event-store.service';
import { Events } from '@app/common';
import { Message, Update } from 'grammy/types';

describe('EventStoreController', () => {
  let controller: EventStoreController;
  let eventsService: EventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventStoreController],
      providers: [
        {
          provide: EventStoreService,
          useValue: {
            createEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventStoreController>(EventStoreController);
    eventsService = module.get<EventStoreService>(EventStoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('message', () => {
    it('should call createEvent with correct parameters', async () => {
      const mockMessage = {
        date: 1234,
        chat: { id: 1234 },
      } as Message;
      await controller.message(mockMessage);
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        mockMessage.date,
        mockMessage.chat.id,
        Events.Message,
        mockMessage,
      );
    });
  });

  describe('edited_message', () => {
    it('should call createEvent with correct parameters', async () => {
      const mockUpdate = {
        edited_message: {
          date: 1234,
          chat: { id: 1234 },
        },
      } as Update;
      await controller.edited_message(mockUpdate);
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        mockUpdate.edited_message.date,
        mockUpdate.edited_message.chat.id,
        Events.EditedMessage,
        mockUpdate,
      );
    });
  });

  describe('message_reaction', () => {
    it('should call createEvent with correct parameters', async () => {
      const mockUpdate = {
        message_reaction: {
          date: 1234,
          chat: { id: 1234 },
        },
      } as Update;
      await controller.message_reaction(mockUpdate);
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        mockUpdate.message_reaction.date,
        mockUpdate.message_reaction.chat.id,
        Events.MessageReaction,
        mockUpdate,
      );
    });
  });

  describe('chat_member', () => {
    it('should call createEvent with correct parameters', async () => {
      const mockUpdate = {
        chat_member: {
          date: 1234,
          chat: { id: 1234 },
        },
      } as Update;
      await controller.chat_member(mockUpdate);
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        mockUpdate.chat_member.date,
        mockUpdate.chat_member.chat.id,
        Events.ChatMemberUpdated,
        mockUpdate,
      );
    });
  });
});
