import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { QuestionResult } from './dto/QuestionResult';
import { AxiosResponse } from 'axios';

@Injectable()
export class QuestionServiceService {
  constructor(private readonly httpService: HttpService) { }

  test(text: string): Promise<AxiosResponse<QuestionResult>> {
    return this.httpService.axiosRef.post(
      'http://telegram-question-service-ext-1/test',
      {
        text,
      },
    );
  }
}
