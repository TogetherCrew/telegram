import { Module } from '@nestjs/common';
import { ChatMemberController } from './chat_member.controller';
import { ChatMemberService } from './chat_member.service';
import { RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j/dist';

@Module({
  imports: [
    RmqModule,
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
  ],
  controllers: [ChatMemberController],
  providers: [ChatMemberService],
})
export class ChatMemberModule {}
