import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { RmqInterceptor } from './interceptors/rmq.interceptor';

@Controller()
@UseInterceptors(RmqInterceptor)
export class GraphStoreController {
  private readonly logger = new Logger(GraphStoreController.name);
}
