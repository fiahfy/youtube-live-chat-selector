export type Settings = {
  types: {
    [authorType in
      | 'guest'
      | 'member'
      | 'moderator'
      | 'owner'
      | 'owner'
      | 'super-chat'
      | 'super-sticker'
      | 'membership']: boolean
  }
}
