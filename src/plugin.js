// AstroBox API Level 4 插件入口。
//
// 两个要点：
//   1. WIT 的 enum 在 JS 里就是字符串（'div'），resource 是 class。
//   2. 宿主接口在 WIT 里是 `async func`，但被**同步 lower**：JS 侧直接当普通函数调，
//      调用期间 JS 线程会阻塞到宿主返回，不需要 await。
import { arch, platform } from 'astrobox:psys-host-v4/os';
import { render, renderToTextCard, getRenderSize, Element } from 'astrobox:psys-host-v4/ui';

export const lifecycle = {
  async onLoad() {
    console.log(`Hello AstroBox! running on ${platform()}/${arch()}`);
  },
};

export const event = {
  async onEvent(eventType, eventPayload) {
    console.log('event:', eventType, eventPayload);
    return '';
  },

  async onUiEvent(eventId, uiEvent, eventPayload) {
    console.log('ui event:', eventId, uiEvent, eventPayload);
    return '';
  },

  async onUiRender(elementId) {
    const size = getRenderSize();
    const root = new Element('div', null).flex().flexDirection('column');
    const title = new Element('p', `Hello from JavaScript (${size.width}x${size.height})`);
    render(elementId, root.child(title));
  },

  async onCardRender(cardId) {
    renderToTextCard(cardId, 'Hello from JavaScript');
  },
};
