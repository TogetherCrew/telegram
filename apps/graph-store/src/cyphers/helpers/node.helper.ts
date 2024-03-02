import { Injectable } from '@nestjs/common';
import { flatten } from 'safe-flat';

@Injectable()
export class NodeHelper {
  createNode(
    name: string,
    type: 'TGUser' | 'TGChat' | 'TGMessage',
    obj: any,
    params: Record<string, unknown> = {},
    idKey = 'id',
  ) {
    if (Object.keys(obj).length < 1) {
      throw new Error('Object needs one or more keys');
    } else if (!obj.hasOwnProperty(idKey)) {
      throw new Error(`Object must have the key: ${idKey}`);
    }

    const id = obj[idKey];
    params[`${name}_id`] = id;

    delete obj[idKey];
    const flat = flatten(obj, '_');

    const setProperties = Object.entries(flat).map(([key, value]) => {
      params[`${name}_${key}`] = value;
      return `${name}.${key} = $${name}_${key}`;
    });

    const query = Object.keys(obj).length
      ? `
    MERGE (${name}:${type} {${idKey}: $${name}_id})
    ON CREATE SET ${setProperties.join(', ')}
    ON MATCH SET ${setProperties.join(', ')}
    `
      : `MERGE (${name}:${type} {${idKey}: $${name}_id})`;

    return { query, params };
  }
}
