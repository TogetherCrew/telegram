import { Controller, Logger } from '@nestjs/common';
import { QuestionServiceService } from './question-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateEvent } from '@app/common';

@Controller()
export class QuestionServiceController {
  private readonly logger = new Logger(QuestionServiceController.name);
  constructor(
    private readonly questionServiceService: QuestionServiceService,
  ) { }

  @MessagePattern(UpdateEvent.MESSAGE)
  async message(@Payload() data): Promise<void> {
    const { update } = data;
    const { message } = update;
    this.logger.log('Message received', message);
  }
}
