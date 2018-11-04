import Logger from './utils/logger'

const id = chrome.runtime.id

const ClassName = {
  button: `${id}-button`,
  mask: `${id}-mask`
}

let disabled
let settings

const updateMessage = async (node) => {
  if (disabled) {
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

const setupControlButton = () => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z')

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.append(path)

  const icon = document.createElement('yt-icon')
  icon.classList.add('style-scope')
  icon.classList.add('yt-live-chat-header-renderer')
  icon.append(svg)

  const iconButton = document.createElement('button')
  iconButton.setAttribute('id', 'button')
  iconButton.classList.add('yt-icon-button')
  iconButton.classList.add('style-scope')
  iconButton.append(icon)

  const button = document.createElement('yt-icon-button')
  button.classList.add(ClassName.button)
  button.classList.add('style-scope')
  button.classList.add('yt-live-chat-header-renderer')
  button.setAttribute(
    'style',
    `
  width: 40px;
  height: 40px;
  padding: 8px;
  `
  )
  button.onclick = () => {
    chrome.runtime.sendMessage({ id: 'disabledToggled' })
  }
  button.append(iconButton)

  const header = document.querySelector('yt-live-chat-header-renderer')
  header.append(button)

  // remove unnecessary button
  button.querySelector('#button').remove()
}

const updateControlButton = (disabled) => {
  const button = document.querySelector(`.${ClassName.button}`)
  button.style.color = disabled
    ? 'var(--yt-live-chat-header-button-color)'
    : '#569df2'
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  Logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id, data } = message
  switch (id) {
    case 'disabledChanged':
      disabled = data.disabled
      updateControlButton(disabled)
      updateMessages()
      break
    case 'stateChanged':
      settings = data.state.settings
      break
  }
})

Logger.log('content script loaded')

document.addEventListener('DOMContentLoaded', async () => {
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

  window.addEventListener('unload', () => {
    observer.disconnect()
  })

  setupControlButton()

  chrome.runtime.sendMessage({ id: 'contentLoaded' })
})
