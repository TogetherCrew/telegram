import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
