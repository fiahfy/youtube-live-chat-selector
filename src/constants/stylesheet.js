import className from './class-name'

const code = `
.${className.badMessage} .${className.mask} {
  background: var(--yt-live-chat-background-color);
  color: var(--yt-spec-text-secondary);
  font-size: smaller;
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
.${className.badMessage} .${className.mask}:hover {
  opacity: 0;
}
yt-live-chat-app > iron-dropdown > div > ytd-menu-popup-renderer {
  max-height: none!important;
}
`

export default code
