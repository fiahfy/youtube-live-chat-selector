import browser from 'webextension-polyfill'
import { readyStore } from '~/store'
import iconOff from '~/assets/icon-off.png'
import iconOn from '~/assets/icon-on.png'

let initialEnabled = true
let enabledStates: { [tabId: number]: boolean } = {}

const getSettings = async () => {
  const store = await readyStore()
  return JSON.parse(JSON.stringify(store.state.settings))
}

const setIcon = async (tabId: number, enabled: boolean) => {
  const path = enabled ? iconOn : iconOff
  await browser.pageAction.setIcon({ tabId, path })
}

const contentLoaded = async (tabId: number) => {
  const enabled = enabledStates[tabId] ?? initialEnabled
  enabledStates = { ...enabledStates, [tabId]: enabled }

  await setIcon(tabId, enabled)
  await browser.pageAction.show(tabId)

  const settings = await getSettings()

  return { enabled, settings }
}

const menuButtonClicked = async (tabId: number) => {
  let enabled = enabledStates[tabId] ?? initialEnabled
  enabled = !enabled

  initialEnabled = enabled

  enabledStates = { ...enabledStates, [tabId]: enabled }

  await setIcon(tabId, enabled)

  await browser.tabs.sendMessage(tabId, {
    id: 'enabledChanged',
    data: { enabled },
  })
}

const settingsChanged = async () => {
  const settings = await getSettings()
  const tabs = await browser.tabs.query({})
  for (const tab of tabs) {
    try {
      tab.id &&
        (await browser.tabs.sendMessage(tab.id, {
          id: 'settingsChanged',
          data: { settings },
        }))
    } catch (e) {} // eslint-disable-line no-empty
  }
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  const { id } = message
  const { tab } = sender
  switch (id) {
    case 'contentLoaded':
      return tab?.id && (await contentLoaded(tab.id))
    case 'menuButtonClicked':
      tab?.id && (await menuButtonClicked(tab.id))
      break
    case 'settingsChanged':
      console.log('settingsChanged')
      await settingsChanged()
      break
  }
})
