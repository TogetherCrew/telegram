import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreService } from './event-store.service';
import { getModelToken, getConnectionToken } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Event } from './schemas/event.schema';

describe('EventStoreService', () => {
  let service: EventStoreService;
  let modelMock: Model<Event>;
  let connectionMock: Connection;

  beforeEach(async () => {
    modelMock = {
      create: jest.fn(),
    } as unknown as Model<Event>; // Adjust the type according to your actual model

    connectionMock = {
      useDb: jest.fn(),
    } as unknown as Connection; // Adjust the type according to your actual connection

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventStoreService,
        {
          provide: getModelToken(Event.name),
          useValue: modelMock,
        },
        {
          provide: getConnectionToken(),
          useValue: connectionMock,
        },
      ],
    }).compile();

    service = module.get<EventStoreService>(EventStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEvent', () => {
    it('should create and save event to the appropriate collection', async () => {
      const timestamp = Date.now();
      const chatId = 123;
      const eventType = 'message';
      const eventData = {
        /* mock event data */
      };

      await service.createEvent(timestamp, chatId, eventType, eventData);

      expect(connectionMock.useDb).toHaveBeenCalledWith(`tg:${chatId}`);
      expect(modelMock.create).toHaveBeenCalledWith({
        timestamp,
        event_type: eventType,
        event_data: eventData,
      });
    });
  });
});
