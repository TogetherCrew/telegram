import { API_CONSTANTS } from 'grammy';

type UpdateType = (typeof API_CONSTANTS.ALL_UPDATE_TYPES)[number];

function createUpdateTypeDictionary(): {
  [key in UpdateType as Uppercase<UpdateType>]: UpdateType;
} {
  const dict: Partial<{
    [key in UpdateType as Uppercase<UpdateType>]: key;
  }> = {};
  for (const type of API_CONSTANTS.ALL_UPDATE_TYPES) {
    dict[type.toUpperCase() as Uppercase<UpdateType>] = type;
  }
  return dict as { [key in UpdateType as Uppercase<key>]: key };
}

export const EventNames = createUpdateTypeDictionary();
