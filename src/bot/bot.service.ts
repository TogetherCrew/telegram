import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Api } from 'telegram';
import { flatMap } from 'utils/helper';

@Injectable()
export class BotService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async addNewTextMessage(msg: Api.Message) {
    const id = msg.id;
    const channelId = msg.peerId['channelId'].value;
    const parsed = await JSON.stringify(msg);
    const data = { dump: flatMap(parsed), id, channelId };
    return this.neo4jService.write(
      `CREATE (n:Message {id: $id,channelId: $channelId, dump: $dump})`,
      data,
    );
  }
  async ReplaceNewTextMessage(msg: Api.Message) {
    const id = msg.id;
    const channelId = msg.peerId['channelId'].value;
    const parsed = await JSON.stringify(msg);
    const data = { dump: flatMap(parsed), id, channelId };
    return this.neo4jService.write(
      'MATCH (n:Message {id: $id}) SET n.channelId = $channelId, n.dump = $dump',
      data,
    );
  }
}
