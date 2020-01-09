import { browser } from 'webextension-polyfill-ts'
import Settings from '~/models/settings'
import className from '~/constants/class-name'
import filterList from '~/assets/filter-list.svg'

let enabled = false
let settings: Settings

const updateMenuButton = () => {
  const button = document.querySelector(`.${className.menuButton}`)
  if (!button) {
    return
  }
  if (enabled) {
    button.classList.add(className.menuButtonActive)
  } else {
    button.classList.remove(className.menuButtonActive)
  }
}

const addMenuButton = () => {
  const header = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer'
  )
  const refIconButton = header && header.querySelector('yt-icon-button')
  if (!header || !refIconButton) {
    return
  }

  const icon = document.createElement('yt-icon')
  icon.classList.add('yt-live-chat-header-renderer', 'style-scope')

  const iconButton = document.createElement('yt-icon-button')
  iconButton.id = 'overflow'
  iconButton.classList.add(
    className.menuButton,
    'style-scope',
    'yt-live-chat-header-renderer'
  )
  iconButton.title = 'Filter messages'
  iconButton.onclick = () => {
    browser.runtime.sendMessage({ id: 'menuButtonClicked' })
  }
  iconButton.append(icon)

  header.insertBefore(iconButton, refIconButton)

  // insert svg after wrapper button appended
  icon.innerHTML = filterList

  updateMenuButton()
}

const updateClasses = () => {
  if (enabled && !settings.types.guest) {
    document.body.classList.add(className.guestHidden)
  } else {
    document.body.classList.remove(className.guestHidden)
  }
  if (enabled && !settings.types.member) {
    document.body.classList.add(className.memberHidden)
  } else {
    document.body.classList.remove(className.memberHidden)
  }
  if (enabled && !settings.types.moderator) {
    document.body.classList.add(className.moderatorHidden)
  } else {
    document.body.classList.remove(className.moderatorHidden)
  }
  if (enabled && !settings.types.owner) {
    document.body.classList.add(className.ownerHidden)
  } else {
    document.body.classList.remove(className.ownerHidden)
  }
  if (enabled && !settings.types.superChat) {
    document.body.classList.add(className.superChatHidden)
  } else {
    document.body.classList.remove(className.superChatHidden)
  }
  if (enabled && !settings.types.superSticker) {
    document.body.classList.add(className.superStickerHidden)
  } else {
    document.body.classList.remove(className.superStickerHidden)
  }
  if (enabled && !settings.types.membership) {
    document.body.classList.add(className.membershipHidden)
  } else {
    document.body.classList.remove(className.membershipHidden)
  }
}

browser.runtime.onMessage.addListener((message) => {
  const { id, data } = message
  switch (id) {
    case 'enabledChanged':
      enabled = data.enabled
      updateMenuButton()
      updateClasses()
      break
    case 'settingsChanged':
      settings = data.settings
      updateClasses()
      break
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.runtime.sendMessage({ id: 'contentLoaded' })
  enabled = data.enabled
  settings = data.settings
  addMenuButton()
})
