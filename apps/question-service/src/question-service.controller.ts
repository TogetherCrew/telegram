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
  async message(@Payload() payload): Promise<void> {
    const { update } = payload;
    const { message } = update;
    const { data } = await this.questionServiceService.test(message.text);
    this.logger.log('Result', data);
  }
}
