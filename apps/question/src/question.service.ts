import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { QuestionResult } from './dto/QuestionResult';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuestionService {
  private uri: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.uri = this.configService.get<string>('question.uri');
  }

  test(text: string): Promise<AxiosResponse<QuestionResult>> {
    return this.httpService.axiosRef.post(this.uri, {
      text,
    });
  }
}
