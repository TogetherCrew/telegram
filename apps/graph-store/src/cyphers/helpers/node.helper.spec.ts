import { NodeHelper } from './node.helper';

describe('NodeHelper', () => {
  test('Basic Object', () => {
    const user = {
      id: 1,
      is_bot: false,
      first_name: 'John',
      username: 'johndoe',
    };

    const nodeHelper = new NodeHelper();
    const { query, params } = nodeHelper.createNode('user', 'TGUser', user);
    expect(query).toEqual(`
    MERGE (user:TGUser {id: $user_id})
    ON CREATE SET user.is_bot = $user_is_bot, SET user.first_name = $user_first_name, SET user.username = $user_username
    ON MATCH SET user.is_bot = $user_is_bot, SET user.first_name = $user_first_name, SET user.username = $user_username
    `);
    expect(params).toEqual({
      user_id: 1,
      user_is_bot: false,
      user_first_name: 'John',
      user_username: 'johndoe',
    });
  });

  test('Id Only', () => {
    const user = { id: 3 };
    const nodeHelper = new NodeHelper();
    const { query, params } = nodeHelper.createNode('user', 'TGUser', user);
    expect(query).toEqual(`MERGE (user:TGUser {id: $user_id})`);
    expect(params).toEqual({ user_id: 3 });
  });

  test('Empty Object', () => {
    const user = {};
    const nodeHelper = new NodeHelper();
    expect(() => nodeHelper.createNode('user', 'TGUser', user)).toThrow(
      'Object needs one or more keys',
    );
  });

  test('Wrong Id', () => {
    const user = { key: '1234' };
    const nodeHelper = new NodeHelper();
    expect(() => nodeHelper.createNode('user', 'TGUser', user)).toThrow(
      'Object must have the key: id',
    );
  });
});
