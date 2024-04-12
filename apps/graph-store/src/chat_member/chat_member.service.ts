import { Injectable, Logger } from '@nestjs/common';
import { Chat, User } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j';
import {
  ChatMemberCypher,
  MEMBER_BANNED,
  MEMBER_DEMOTED,
  MEMBER_JOINED,
  MEMBER_LEFT,
  MEMBER_PROMOTED,
  MEMBER_RESTRICTED,
  MEMBER_UNBANNED,
  MEMBER_UNRESTRICTED,
} from './chat_member.cypher';

@Injectable()
export class ChatMemberService {
  private readonly logger = new Logger(ChatMemberService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async promoted(
    chat: Chat,
    user: User,
    date: number,
    from: User,
    tx?: Transaction,
  ) {
    this.write(
      MEMBER_PROMOTED,
      {
        chat,
        user,
        date,
        from,
      },
      tx,
    );
  }
  async demoted(
    chat: Chat,
    user: User,
    date: number,
    from: User,
    tx?: Transaction,
  ) {
    this.write(
      MEMBER_DEMOTED,
      {
        chat,
        user,
        date,
        from,
      },
      tx,
    );
  }
  async unrestricted(
    chat: Chat,
    user: User,
    date: number,
    from: User,
    tx?: Transaction,
  ) {
    this.write(
      MEMBER_UNRESTRICTED,
      {
        chat,
        user,
        date,
        from,
      },
      tx,
    );
  }
  async restricted(
    chat: Chat,
    user: User,
    date: number,
    from: User,
    tx?: Transaction,
  ) {
    this.write(
      MEMBER_RESTRICTED,
      {
        chat,
        user,
        date,
        from,
      },
      tx,
    );
  }
  async unbanned(
    chat: Chat,
    user: User,
    date: number,
    from: User,
    tx?: Transaction,
  ) {
    this.write(
      MEMBER_UNBANNED,
      {
        chat,
        user,
        date,
        from,
      },
      tx,
    );
  }
  async joined(
    chat: Chat,
    user: User,
    date: number,
    from: User,
    tx?: Transaction,
  ) {
    this.write(
      MEMBER_JOINED,
      {
        chat,
        user,
        date,
        from,
      },
      tx,
    );
  }
  async banned(
    chat: Chat,
    user: User,
    date: number,
    from: User,
    tx?: Transaction,
  ) {
    this.write(
      MEMBER_BANNED,
      {
        chat,
        user,
        date,
        from,
      },
      tx,
    );
  }
  async left(
    chat: Chat,
    user: User,
    date: number,
    from: User,
    tx?: Transaction,
  ) {
    this.write(
      MEMBER_LEFT,
      {
        chat,
        user,
        date,
        from,
      },
      tx,
    );
  }

  private async write(cypher: ChatMemberCypher, params: any, tx?: Transaction) {
    try {
      if (tx) {
        tx.run(cypher, params);
      } else {
        this.neo4jService.write(cypher, params);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
