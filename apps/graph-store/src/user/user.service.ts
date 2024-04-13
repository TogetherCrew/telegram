import { Injectable, Logger } from '@nestjs/common';
import { User } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j';

const CREATE_OR_UPDATE_USER = `
MERGE (user:TGUser { id: $user.id })
  ON CREATE
    SET user = apoc.map.merge(user, apoc.map.clean($user, ['id'], [null])),
      user.created_at = timestamp(),
      user.updated_at = timestamp()
  ON MATCH
    SET user = apoc.map.merge(user, apoc.map.clean($user, ['id'], [null])),
      user.updated_at = timestamp()
RETURN user
` as const;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async createOrUpdate(user: User, tx?: Transaction): Promise<void> {
    try {
      if (tx) {
        tx.run(CREATE_OR_UPDATE_USER, { user });
      } else {
        await this.neo4jService.write(CREATE_OR_UPDATE_USER, { user });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
