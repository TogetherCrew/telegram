import { Module } from '@nestjs/common';
import { GraphStoreController } from './graph-store.controller';
import { RmqModule, neo4jConfig, rmqConfig, schemaConfig } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';
import { ChatMemberModule } from './chat_member/chat_member.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { JoinedModule } from './joined/joined.module';
import { RepliedModule } from './replied/replied.module';
import { MentionedModule } from './mentioned/mentioned.module';
import { EditedMessageModule } from './edited_message/edited_message.module';
import { MessageReactionModule } from './message_reaction/message_reaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig, neo4jConfig],
      isGlobal: true,
    }),
    RmqModule,
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
    ChatMemberModule,
    MessageModule,
    ChatModule,
    UserModule,
    JoinedModule,
    RepliedModule,
    MentionedModule,
    EditedMessageModule,
    MessageReactionModule,
  ],
  controllers: [GraphStoreController],
})
export class GraphStoreModule {}
