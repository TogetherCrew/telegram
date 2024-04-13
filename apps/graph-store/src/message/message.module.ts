import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j/dist';
import { ChatService } from '../chat/chat.service';
import { UserService } from '../user/user.service';
import { JoinedService } from '../joined/joined.service';
import { RepliedService } from '../replied/replied.service';
import { MentionedService } from '../mentioned/mentioned.service';

@Module({
  imports: [
    RmqModule,
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
  ],
  providers: [
    MessageService,
    ChatService,
    UserService,
    JoinedService,
    RepliedService,
    MentionedService,
  ],
  controllers: [MessageController],
})
export class MessageModule {}
