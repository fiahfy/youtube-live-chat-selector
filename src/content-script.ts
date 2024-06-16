import { Settings } from '~/models'
import playlistAddCheck from '~/assets/playlist-add-check.svg?raw'
import './content-script.css'

const ClassName = {
  menuButton: 'ylcs-menu-button',
  activeMenuButton: 'ylcs-active-menu-button',
  guestHidden: 'ylcs-guest-hidden',
  memberHidden: 'ylcs-member-hidden',
  moderatorHidden: 'ylcs-moderator-hidden',
  ownerHidden: 'ylcs-owner-hidden',
  superChatHidden: 'ylcs-superchat-hidden',
  superStickerHidden: 'ylcs-supersticker-hidden',
  membershipHidden: 'ylcs-membership-hidden',
}

let enabled: boolean
let settings: Settings

const updateMenuButton = () => {
  const button = document.querySelector(`.${ClassName.menuButton}`)
  if (!button) {
    return
  }
  if (enabled) {
    button.classList.add(ClassName.activeMenuButton)
  } else {
    button.classList.remove(ClassName.activeMenuButton)
  }
}

const addMenuButton = () => {
  const header = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer',
  )
  const refIconButton = header && header.querySelector('yt-live-chat-button')
  if (!header || !refIconButton) {
    return
  }

  const icon = document.createElement('yt-icon')
  icon.classList.add('style-scope', 'yt-button-renderer')

  const button = document.createElement('button')
  button.id = 'button'
  button.classList.add('style-scope', 'yt-icon-button')

  const iconButton = document.createElement('yt-icon-button')
  iconButton.id = 'button'
  iconButton.classList.add('style-scope', 'yt-button-renderer')

  const a = document.createElement('a')
  a.tabIndex = -1
  a.classList.add('yt-simple-endpoint', 'style-scope', 'yt-button-renderer')

  const liveChatButton = document.createElement('yt-live-chat-button')
  liveChatButton.id = 'live-chat-header-context-menu'
  liveChatButton.classList.add(
    ClassName.menuButton,
    'style-scope',
    'yt-live-chat-header-renderer',
  )
  iconButton.title = 'Select Messages'
  iconButton.onclick = async () => {
    await chrome.runtime.sendMessage({ type: 'menu-button-clicked' })
  }

  header.insertBefore(liveChatButton, refIconButton)

  liveChatButton.append(a)
  a.append(iconButton)
  iconButton.append(button)
  button.append(icon)

  // insert svg after wrapper button appended
  icon.innerHTML = playlistAddCheck

  // remove unnecessary elements
  liveChatButton.querySelector('yt-button-renderer')?.remove()
  iconButton.querySelector('button')?.remove()

  updateMenuButton()
}

const updateClasses = () => {
  if (enabled && !settings.types['guest']) {
    document.body.classList.add(ClassName.guestHidden)
  } else {
    document.body.classList.remove(ClassName.guestHidden)
  }
  if (enabled && !settings.types['member']) {
    document.body.classList.add(ClassName.memberHidden)
  } else {
    document.body.classList.remove(ClassName.memberHidden)
  }
  if (enabled && !settings.types['moderator']) {
    document.body.classList.add(ClassName.moderatorHidden)
  } else {
    document.body.classList.remove(ClassName.moderatorHidden)
  }
  if (enabled && !settings.types['owner']) {
    document.body.classList.add(ClassName.ownerHidden)
  } else {
    document.body.classList.remove(ClassName.ownerHidden)
  }
  if (enabled && !settings.types['super-chat']) {
    document.body.classList.add(ClassName.superChatHidden)
  } else {
    document.body.classList.remove(ClassName.superChatHidden)
  }
  if (enabled && !settings.types['super-sticker']) {
    document.body.classList.add(ClassName.superStickerHidden)
  } else {
    document.body.classList.remove(ClassName.superStickerHidden)
  }
  if (enabled && !settings.types['membership']) {
    document.body.classList.add(ClassName.membershipHidden)
  } else {
    document.body.classList.remove(ClassName.membershipHidden)
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message
  switch (type) {
    case 'enabled-changed':
      enabled = data.enabled
      updateMenuButton()
      updateClasses()
      return sendResponse()
    case 'settings-changed':
      settings = data.settings
      updateClasses()
      return sendResponse()
  }
})

chrome.runtime.sendMessage({ type: 'content-loaded' }).then((data) => {
  enabled = data.enabled
  settings = data.settings
  addMenuButton()
  updateClasses()
})
