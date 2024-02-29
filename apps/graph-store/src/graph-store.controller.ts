import { Controller, Get } from '@nestjs/common';
import { GraphStoreService } from './graph-store.service';

@Controller()
export class GraphStoreController {
  constructor(private readonly graphStoreService: GraphStoreService) {}

  @Get()
  getHello(): string {
    return this.graphStoreService.getHello();
  }
}
