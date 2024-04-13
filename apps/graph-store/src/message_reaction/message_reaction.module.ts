import { Module } from '@nestjs/common';
import { MessageReactionService } from './message_reaction.service';
import { MessageReactionController } from './message_reaction.controller';
import { RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j/dist';
import { ChatService } from '../chat/chat.service';
import { JoinedService } from '../joined/joined.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    RmqModule,
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
  ],
  providers: [MessageReactionService, ChatService, UserService, JoinedService],
  controllers: [MessageReactionController],
})
export class MessageReactionModule {}
