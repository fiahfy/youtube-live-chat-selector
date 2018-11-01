import Logger from './utils/logger'
import Storage from './utils/storage'

const ClassName = {
  button: 'ylcfl-button',
  mask: 'ylcfl-mask'
}

let enabled = false
let settings

const loadSettings = async () => {
  settings = (await Storage.get()).settings
}

const updateMessage = async (node) => {
  if (!enabled) {
    const mask = node.querySelector(`.${ClassName.mask}`)
    if (mask) {
      mask.remove()
    }
    return
  }

  if (node.tagName.toLowerCase() !== 'yt-live-chat-text-message-renderer') {
    return
  }

  const message = node.querySelector('#message').innerText
  if (message.indexOf('い') === -1) {
    return
  }

  const mask = document.createElement('div')
  mask.classList.add(ClassName.mask)
  const span = document.createElement('span')
  span.innerText = 'Bad comment'
  mask.appendChild(span)
  node.appendChild(mask)
}

const updateMessages = () => {
  Array.from(
    document.querySelectorAll('#items.yt-live-chat-item-list-renderer>*')
  ).forEach((node) => {
    updateMessage(node)
  })
}

const setupControlButton = (enabled) => {
  let iconButton = document.querySelector(`.${ClassName.button}`)
  if (!iconButton) {
    const header = document.querySelector('yt-live-chat-header-renderer')

    iconButton = document.createElement('yt-icon-button')
    iconButton.classList.add(ClassName.button)
    iconButton.classList.add('style-scope')
    iconButton.classList.add('yt-live-chat-header-renderer')
    iconButton.setAttribute(
      'style',
      `
    width: 40px;
    height: 40px;
    padding: 8px;
    `
    )

    const button = document.createElement('button')
    button.setAttribute('id', 'button')
    button.classList.add('yt-icon-button')
    button.classList.add('style-scope')

    const icon = document.createElement('yt-icon')
    icon.classList.add('style-scope')
    icon.classList.add('yt-live-chat-header-renderer')

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z')

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.append(path)

    icon.append(svg)
    button.append(icon)
    iconButton.append(button)
    header.append(iconButton)
    // remove unnecessary button
    iconButton.querySelector('#button').remove()
    iconButton.onclick = () => {
      chrome.runtime.sendMessage({ id: 'controlButtonClicked' })
    }
  }
  iconButton.style.color = enabled
    ? '#569df2'
    : 'var(--yt-live-chat-header-button-color)'
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  Logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id, data } = message
  switch (id) {
    case 'enabledChanged':
      enabled = data.enabled
      setupControlButton(enabled)
      updateMessages()
      break
    case 'stateChanged':
      await loadSettings()
      break
  }
})

Logger.log('content script loaded')

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings()

  const style = document.createElement('style')
  style.innerText = `
  .${ClassName.mask} {
    background: var(--yt-live-chat-background-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    transition: opacity .3s;
  }
  .${ClassName.mask}:hover {
    opacity: 0;
  }
  `
  document.head.appendChild(style)

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const nodes = Array.from(mutation.addedNodes)
      nodes.forEach((node) => {
        updateMessage(node)
      })
    })
  })
  const items = document.querySelector('#items.yt-live-chat-item-list-renderer')
  observer.observe(items, { childList: true })

  chrome.runtime.sendMessage({ id: 'contentLoaded' })

  window.addEventListener('unload', () => {
    observer.disconnect()
  })
})
