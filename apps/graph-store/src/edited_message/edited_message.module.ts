import { Module } from '@nestjs/common';
import { EditedMessageController } from './edited_message.controller';
import { ChatService } from '../chat/chat.service';
import { JoinedService } from '../joined/joined.service';
import { MentionedService } from '../mentioned/mentioned.service';
import { MessageService } from '../message/message.service';
import { RepliedService } from '../replied/replied.service';
import { UserService } from '../user/user.service';
import { RmqModule } from '@app/common';

@Module({
  imports: [RmqModule],
  controllers: [EditedMessageController],
  providers: [
    MessageService,
    ChatService,
    UserService,
    JoinedService,
    RepliedService,
    MentionedService,
  ],
})
export class EditedMessageModule {}
