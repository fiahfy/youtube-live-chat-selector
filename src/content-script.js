import browser from 'webextension-polyfill'
import className from './constants/class-name'
import filterList from './assets/filter-list.svg'

let enabled = false
let settings = {}

const addMenuButton = () => {
  const header = document.querySelector(
    '#chat-messages > yt-live-chat-header-renderer'
  )
  const refIconButton = header && header.querySelector('yt-icon-button')
  if (!header || !refIconButton) {
    return
  }

  const icon = document.createElement('yt-icon')
  icon.classList.add('style-scope')
  icon.classList.add('yt-live-chat-header-renderer')
  icon.innerHTML = filterList

  const button = document.createElement('button')
  button.setAttribute('id', 'button')
  button.classList.add('yt-icon-button')
  button.classList.add('style-scope')
  button.append(icon)

  const iconButton = document.createElement('yt-icon-button')
  iconButton.classList.add(className.menuButton)
  iconButton.classList.add('style-scope')
  iconButton.classList.add('yt-live-chat-header-renderer')
  iconButton.title = 'Filter messages'
  iconButton.onclick = () => {
    browser.runtime.sendMessage({ id: 'menuButtonClicked' })
  }
  iconButton.append(button)

  header.insertBefore(iconButton, refIconButton)

  // remove unnecessary generated button
  iconButton.querySelector('#button').remove()

  updateMenuButton()
}

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

const updateClasses = () => {
  if (enabled && !settings.types.includes('guest')) {
    document.body.classList.add(className.guestHidden)
  } else {
    document.body.classList.remove(className.guestHidden)
  }
  if (enabled && !settings.types.includes('member')) {
    document.body.classList.add(className.memberHidden)
  } else {
    document.body.classList.remove(className.memberHidden)
  }
  if (enabled && !settings.types.includes('moderator')) {
    document.body.classList.add(className.moderatorHidden)
  } else {
    document.body.classList.remove(className.moderatorHidden)
  }
  if (enabled && !settings.types.includes('owner')) {
    document.body.classList.add(className.ownerHidden)
  } else {
    document.body.classList.remove(className.ownerHidden)
  }
  if (enabled && !settings.types.includes('super_chat')) {
    document.body.classList.add(className.superChatHidden)
  } else {
    document.body.classList.remove(className.superChatHidden)
  }
  if (enabled && !settings.types.includes('super_sticker')) {
    document.body.classList.add(className.superStickerHidden)
  } else {
    document.body.classList.remove(className.superStickerHidden)
  }
  if (enabled && !settings.types.includes('membership')) {
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
