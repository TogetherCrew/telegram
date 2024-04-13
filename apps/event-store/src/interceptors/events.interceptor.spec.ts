import { Test, TestingModule } from '@nestjs/testing';
import { EventsInterceptor } from './events.interceptor';
import { of } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { RmqService } from '@app/common';

// Mock RmqService
class RmqServiceMock {
  ack = jest.fn();
}

describe('EventsInterceptor', () => {
  let interceptor: EventsInterceptor;
  let rmqService: RmqServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsInterceptor,
        // Provide mock RmqService
        { provide: RmqService, useClass: RmqServiceMock },
      ],
    }).compile();

    interceptor = module.get<EventsInterceptor>(EventsInterceptor);
    rmqService = module.get<RmqServiceMock>(RmqService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should call ack method of RmqService when intercepting', () => {
    const mockContext = {
      switchToRpc: jest.fn().mockReturnThis(),
      getContext: jest.fn().mockReturnValue({
        getChannelRef: jest.fn(),
        getMessage: jest.fn(),
      }),
    } as unknown as ExecutionContext;
    const mockCallHandler = {
      handle: jest.fn().mockReturnValue(of(null)), // Mock returning an observable
    } as CallHandler;

    // Intercept the call
    interceptor.intercept(mockContext, mockCallHandler);

    // You can assert that the ack method is called synchronously

    // If you want to assert behavior from the observable, you can subscribe to it
    // and add your assertions inside the subscribe block
    mockCallHandler.handle().subscribe({
      next: () => {
        // Assert behavior here
      },
      error: () => {
        // Handle error if needed
      },
      complete: () => {
        // Handle completion if needed
        expect(rmqService.ack).toHaveBeenCalled();
      },
    });
  });
});
