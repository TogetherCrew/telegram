import { Injectable, Logger } from '@nestjs/common';
import { Chat, User } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j';

const JOINED_COUNT = `
MATCH (user:TGUser { id: $user.id })-[r:JOINED]->(chat:TGChat { id: $chat.id })
RETURN count(r) AS count
`;

const CREATE_JOINED = `
MATCH (user:TGUser { id: $user.id })
MATCH (chat:TGChat { id: $chat.id })
MERGE (user)-[r:JOINED { date: $date }]->(chat)
RETURN r
`;

@Injectable()
export class JoinedService {
  private readonly logger = new Logger(JoinedService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async count(chat: Chat, user: User): Promise<number> {
    const result = await this.neo4jService.read(JOINED_COUNT, { chat, user });
    return result.records[0].get('count');
  }

  async create(
    chat: Chat,
    user: User,
    date: number = 0,
    tx?: Transaction,
  ): Promise<any> {
    if (tx) {
      tx.run(CREATE_JOINED, { chat, user, date });
    } else {
      await this.neo4jService.write(CREATE_JOINED, { chat, user, date });
    }
  }
}
