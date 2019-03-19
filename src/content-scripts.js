import logger from './utils/logger'
import className from './constants/class-name'

let disabled = false
let settings = null

const isInvalidAuthor = (author) => {
  return !!settings.authorFilters.find((filter) => {
    return author.includes(filter.keyword)
  })
}

const isInvalidMessage = (message) => {
  return !!settings.messageFilters.find((filter) => {
    return message.includes(filter.keyword)
  })
}

const filter = async (node) => {
  if (disabled) {
    const mask = node.querySelector(`.${className.mask}`)
    if (mask) {
      mask.remove()
    }
    node.classList.remove(className.badMessage)
    return
  }

  const tags = [
    'yt-live-chat-text-message-renderer',
    'yt-live-chat-paid-message-renderer'
  ]
  if (!tags.includes(node.tagName.toLowerCase())) {
    return
  }

  let result = ''
  const author = node.querySelector('#author-name').innerText
  if (isInvalidAuthor(author)) {
    result = '### Bad author ###'
  }
  const message = node.querySelector('#message').innerText
  if (isInvalidMessage(message)) {
    result = '### Bad message ###'
  }
  if (!result) {
    return
  }

  const span = document.createElement('span')
  span.innerText = result

  const mask = document.createElement('div')
  mask.classList.add(className.mask)
  mask.append(span)

  node.classList.add(className.badMessage)
  node.append(mask)
}

const updateMessages = () => {
  Array.from(
    document.querySelectorAll('#items.yt-live-chat-item-list-renderer>*')
  ).forEach((node) => {
    filter(node)
  })
}

const observeChat = () => {
  const items = document.querySelector('#items.yt-live-chat-item-list-renderer')
  if (!items) {
    return
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const nodes = Array.from(mutation.addedNodes)
      nodes.forEach((node) => {
        filter(node)
      })
    })
  })
  observer.observe(items, { childList: true })
}

const addControlButton = (disabled) => {
  const header = document.querySelector('yt-live-chat-header-renderer')
  if (!header) {
    return
  }

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
  button.classList.add(className.controlButton)
  button.classList.add('style-scope')
  button.classList.add('yt-live-chat-header-renderer')
  button.style.opacity = 0
  button.style.transition = 'opacity 1s'
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

  header.append(button)

  // remove unnecessary button
  button.querySelector('#button').remove()

  updateControlButton(disabled)

  // fade in...
  setTimeout(() => {
    button.style.opacity = 1
  }, 0)
}

const updateControlButton = (disabled) => {
  const icon = document.querySelector(
    `.${className.controlButton}>button>yt-icon`
  )
  icon.style.color = disabled ? 'var(--yt-spec-icon-inactive)' : '#569df2'
}

// const setupMenuItem = () => {
//   if (document.querySelector(`.${className.menuItem}`)) {
//     return
//   }

//   const string = document.createElement('yt-formatted-string')
//   string.classList.add('style-scope')
//   string.classList.add('ytd-menu-navigation-item-renderer')
//   string.innerText = 'Add author to NG'

//   const paper = document.createElement('paper-item')
//   paper.classList.add('style-scope')
//   paper.classList.add('ytd-menu-navigation-item-renderer')
//   paper.append(string)

//   const anchor = document.createElement('a')
//   anchor.classList.add('style-scope')
//   anchor.classList.add('yt-simple-endpoint')
//   anchor.classList.add('ytd-menu-navigation-item-renderer')
//   anchor.append(paper)

//   const item = document.createElement('ytd-menu-navigation-item-renderer')
//   item.classList.add(className.menuItem)
//   item.classList.add('style-scope')
//   item.classList.add('ytd-menu-popup-renderer')
//   item.onclick = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     // console.log('click')
//     // console.log(author)
//   }
//   item.append(anchor)

//   const menu = document.querySelector('#items.ytd-menu-popup-renderer')
//   menu.append(item)
// }

// const addPopupObserver = () => {
//   const popup = document.querySelector('yt-live-chat-app > iron-dropdown')
//   const popupObserver = new MutationObserver(() => {
//     if (popup.style.display === 'none') {
//       author = ''
//     }
//     setupMenuItem()
//   })
//   popupObserver.observe(popup, { attributes: true })
// }

// const addEventListener = () => {
//   document
//     .querySelector('#items.yt-live-chat-item-list-renderer')
//     .addEventListener('click', (e) => {
//       if (e.target && e.target.tagName.toLowerCase() === 'yt-icon') {
//         author = e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
//           '#author-name'
//         ).innerText
//       }
//     })
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

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

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ id: 'contentLoaded' }, (data) => {
    disabled = data.disabled
    settings = data.state.settings

    observeChat()
    // addEventListener()
    addControlButton()
    updateMessages()
  })
})

logger.log('content script loaded')
