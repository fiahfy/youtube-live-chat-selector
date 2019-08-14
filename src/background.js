import browser from 'webextension-polyfill'
import createStore from './store'
import code from './constants/stylesheet'
import icon from './assets/icon.png'
import iconOn from './assets/icon-on.png'

let initialState = { enabled: false }
let tabStates = {}

const getSettings = async () => {
  const store = await createStore(true)
  return JSON.parse(JSON.stringify(store.state))
}

const setIcon = async (tabId) => {
  const path = tabStates[tabId] && tabStates[tabId].enabled ? iconOn : icon
  await browser.pageAction.setIcon({ tabId, path })
}

const initTab = async (tabId, frameId) => {
  const enabled = initialState.enabled
  tabStates = { ...tabStates, [tabId]: { enabled } }

  await setIcon(tabId)
  await browser.pageAction.show(tabId)
  await browser.tabs.insertCSS(tabId, { frameId, code })

  const settings = await getSettings()

  return { enabled, settings }
}

const getStateOnCurrentTab = async () => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  if (!tabs) {
    return { enabled: false }
  }
  const tabId = tabs[0].id

  return { enabled: !!(tabStates[tabId] && tabStates[tabId].enabled) }
}

const toggleEnabled = async (tabId) => {
  const enabled = !(tabStates[tabId] && tabStates[tabId].enabled)
  tabStates = {
    ...tabStates,
    [tabId]: { ...(tabStates[tabId] || {}), enabled }
  }

  await setIcon(tabId)

  await browser.tabs.sendMessage(tabId, {
    id: 'enabledChanged',
    data: { enabled }
  })
}

const enabledChangedOnCurrentTab = async (enabled) => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  if (!tabs) {
    return
  }
  const tabId = tabs[0].id

  tabStates = {
    ...tabStates,
    [tabId]: { ...(tabStates[tabId] || {}), enabled }
  }

  await setIcon(tabId)

  await browser.tabs.sendMessage(tabId, {
    id: 'enabledChanged',
    data: { enabled }
  })
}

const settingsChanged = async () => {
  const settings = await getSettings()
  const tabs = await browser.tabs.query({})
  for (let tab of tabs) {
    try {
      await browser.tabs.sendMessage(tab.id, {
        id: 'settingsChanged',
        data: { settings }
      })
    } catch (e) {} // eslint-disable-line no-empty
  }
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  const { id, data } = message
  const { tab, frameId } = sender
  switch (id) {
    case 'contentLoaded':
      return await initTab(tab.id, frameId)
    case 'popupLoaded': {
      return await getStateOnCurrentTab()
    }
    case 'menuButtonClicked':
      await toggleEnabled(tab.id)
      break
    case 'enabledChanged':
      await enabledChangedOnCurrentTab(data.enabled)
      break
    case 'settingsChanged':
      await settingsChanged()
      break
  }
})
