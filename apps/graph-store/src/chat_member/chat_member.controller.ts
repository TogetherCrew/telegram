import { UpdateEvent } from '@app/common';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DChatMemberUpdated } from '../decorators/chatMemberUpdated.decorator';
import { RmqInterceptor } from '../interceptors/rmq.interceptor';
import { Chat, ChatMemberUpdated } from 'grammy/types';
import { ChatMemberService } from './chat_member.service';
import { DChat } from '../decorators/chat.decorator';
import { FilterQuery } from 'grammy';

type Status =
  | 'member'
  | 'left'
  | 'kicked'
  | 'restricted'
  | 'administrator'
  | 'creator';
type Action =
  | 'LEFT'
  | 'BANNED'
  | 'JOINED'
  | 'UNBANNED'
  | 'RESTRICTED'
  | 'UNRESTRICTED'
  | 'PROMOTED'
  | 'DEMOTED';

@Controller('chat-member')
@UseInterceptors(RmqInterceptor)
export class ChatMemberController {
  private readonly logger = new Logger(ChatMemberController.name);

  constructor(private readonly chatMemberService: ChatMemberService) {}

  @MessagePattern(UpdateEvent.CHAT_MEMBER)
  async chat_member(
    @DChat() chat: Chat,
    @DChatMemberUpdated() chat_member: ChatMemberUpdated,
  ): Promise<void> {
    this.logger.log(`Received ${UpdateEvent.CHAT_MEMBER} for ${chat.id}`);

    const {
      date,
      new_chat_member: { user, status },
      old_chat_member,
      from,
    } = chat_member;

    const action = this.determineAction(old_chat_member.status, status);

    switch (action) {
      case 'LEFT':
        this.chatMemberService.left(chat, user, date, from);
        break;
      case 'BANNED':
        this.chatMemberService.banned(chat, user, date, from);
        break;
      case 'JOINED':
        this.chatMemberService.joined(chat, user, date, from);
        break;
      case 'UNBANNED':
        this.chatMemberService.unbanned(chat, user, date, from);
        break;
      case 'RESTRICTED':
        this.chatMemberService.restricted(chat, user, date, from);
        break;
      case 'UNRESTRICTED':
        this.chatMemberService.unrestricted(chat, user, date, from);
        break;
      case 'PROMOTED':
        this.chatMemberService.promoted(chat, user, date, from);
        break;
      case 'DEMOTED':
        this.chatMemberService.demoted(chat, user, date, from);
        break;
    }
  }

  private determineAction(oldStatus: Status, newStatus: Status): Action | null {
    if (oldStatus === 'member' && newStatus === 'left') {
      return 'LEFT';
    } else if (oldStatus === 'left' && newStatus === 'member') {
      return 'JOINED';
    } else if (oldStatus === 'member' && newStatus === 'administrator') {
      return 'PROMOTED';
    } else if (oldStatus === 'administrator' && newStatus === 'member') {
      return 'DEMOTED';
    } else if (newStatus === 'kicked') {
      return 'BANNED';
    } else if (newStatus === 'restricted') {
      return 'RESTRICTED';
    } else if (oldStatus === 'kicked') {
      return 'UNBANNED';
    } else if (oldStatus === 'restricted') {
      return 'UNRESTRICTED';
    } else if (newStatus === 'left') {
      return 'LEFT';
    }
    return null;
  }
}
