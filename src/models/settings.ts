export type AuthorType =
  | 'guest'
  | 'member'
  | 'moderator'
  | 'owner'
  | 'owner'
  | 'super-chat'
  | 'super-sticker'
  | 'membership'
export type Types = { [authorType in AuthorType]: boolean }

export type Settings = {
  types: Types
}
