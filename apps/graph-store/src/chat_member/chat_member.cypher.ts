import { createOrUpdateChat, createOrUpdateUser } from '../helpers/cyphers';

function createCypher(edgeName: string): string {
  return [
    createOrUpdateChat,
    createOrUpdateUser,
    `MERGE (user)-[r:${edgeName} { date: $date, actor: $from.id }]->(chat)`,
    'RETURN chat, user, r',
  ].join('\n');
}

export const MEMBER_BANNED = createCypher('BANNED');
export const MEMBER_DEMOTED = createCypher('DEMOTED');
export const MEMBER_JOINED = createCypher('JOINED');
export const MEMBER_LEFT = createCypher('LEFT');
export const MEMBER_PROMOTED = createCypher('PROMOTED');
export const MEMBER_RESTRICTED = createCypher('RESTRICTED');
export const MEMBER_UNBANNED = createCypher('UNBANNED');
export const MEMBER_UNRESTRICTED = createCypher('UNRESTRICTED');

export type ChatMemberCypher =
  | typeof MEMBER_BANNED
  | typeof MEMBER_DEMOTED
  | typeof MEMBER_JOINED
  | typeof MEMBER_LEFT
  | typeof MEMBER_PROMOTED
  | typeof MEMBER_RESTRICTED
  | typeof MEMBER_UNBANNED
  | typeof MEMBER_UNRESTRICTED;
