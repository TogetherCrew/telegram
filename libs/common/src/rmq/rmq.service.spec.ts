import { ConfigService } from '@nestjs/config';
import { RmqContext, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

const rmqUri = 'amqp://mocked-rmq-uri';

describe('RmqService', () => {
  let rmqService: RmqService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue(rmqUri),
    } as unknown as ConfigService;

    rmqService = new RmqService(configService);
  });

  describe('getOptions', () => {
    it('should return RMQ options with provided queue', () => {
      const queue = 'testQueue';
      const expectedOptions = {
        transport: Transport.RMQ,
        options: {
          urls: [rmqUri],
          queue: queue,
          noAck: false,
          persistent: true,
        },
      };

      const options = rmqService.getOptions(queue);

      expect(options).toEqual(expectedOptions);
      expect(configService.get).toHaveBeenCalledWith('rmq.uri');
    });

    it('should allow configuring noAck option', () => {
      const queue = 'testQueue';
      const noAck = true;
      const expectedOptions = {
        transport: Transport.RMQ,
        options: {
          urls: [rmqUri],
          queue: queue,
          noAck: true,
          persistent: true,
        },
      };

      const options = rmqService.getOptions(queue, noAck);

      expect(options).toEqual(expectedOptions);
      expect(configService.get).toHaveBeenCalledWith('rmq.uri');
    });
  });

  describe('ack', () => {
    it('should acknowledge message', () => {
      const channelMock = {
        ack: jest.fn(),
      };
      const messageMock = {};

      const context: Partial<RmqContext> = {
        getChannelRef: () => channelMock,
        getMessage: () => messageMock,
      };

      rmqService.ack(context as RmqContext);

      expect(channelMock.ack).toHaveBeenCalledWith(messageMock);
    });
  });
});
