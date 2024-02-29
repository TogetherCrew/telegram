import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphStoreService {
  getHello(): string {
    return 'Hello World!';
  }
}
