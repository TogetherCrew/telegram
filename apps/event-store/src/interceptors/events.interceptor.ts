import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class EventsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const channel = context
      .switchToRpc()
      .getContext<RmqContext>()
      .getChannelRef();
    const originalMsg = context
      .switchToRpc()
      .getContext<RmqContext>()
      .getMessage();
    return next.handle().pipe(
      tap(async () => {
        await channel.ack(originalMsg);
      }),
    );
  }
}
