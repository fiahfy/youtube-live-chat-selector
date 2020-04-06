export type AuthorType =
  | 'guest'
  | 'member'
  | 'moderator'
  | 'owner'
  | 'owner'
  | 'super_chat'
  | 'super_sticker'
  | 'membership'

export default interface Settings {
  enabledTypes: AuthorType[]
}
