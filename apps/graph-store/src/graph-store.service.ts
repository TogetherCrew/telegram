import { Injectable } from '@nestjs/common';
import { Event } from 'apps/event-store/src/schemas/event.schema';
import { Neo4jService } from 'nest-neo4j/dist';
import { NodeHelper } from './cyphers/helpers/node.helper';

@Injectable()
export class GraphStoreService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly nodeHelper: NodeHelper,
  ) {}

  async message({ event_data, timestamp }: Event) {
    const chatCypher = this.nodeHelper.createNode(
      'chat',
      'TGChat',
      event_data.chat,
    );
    const userCypher = this.nodeHelper.createNode(
      'user',
      'TGUser',
      event_data.from,
    );
    const message = event_data;
    delete message['from'];
    delete message['chat'];
    const messageCypher = this.nodeHelper.createNode(
      'message',
      'TGMessage',
      message,
      {},
      'message_id',
    );

    const params = {
      ...chatCypher.params,
      ...userCypher.params,
      ...messageCypher.params,
      timestamp,
    };

    const relationshipsQuery = `
    MERGE (message)-[:SENT_IN {timestamp: $timestamp}]->(chat)
    MERGE (user)-[:CREATED_MESSAGE {timestamp: $timestamp}]->(message)
    `;

    const query = [
      chatCypher.query,
      userCypher.query,
      messageCypher.query,
      relationshipsQuery,
    ].join('\n');

    console.log(query);
    console.log(params);

    await this.neo4jService.write(query, params);
  }
}
