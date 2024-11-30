import { MessageType } from '../../types';
import { delay } from '../../utils';

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener(
  async (message, sender: chrome.runtime.MessageSender) => {
    const tabId = sender?.tab?.id as number;

    switch (message.type) {
      case MessageType.OPEN_SIDE_PANEL:
        {
          await chrome.sidePanel.open({ tabId });

          await chrome.sidePanel.setOptions({
            tabId,
            path: 'sidePanel.html',
            enabled: true,
          });

          await delay(200);

          const { dataType, data } = message;

          chrome.runtime.sendMessage({
            type: MessageType.SET_SIDE_PANEL_DATA,
            dataType,
            data,
          });
        }
        break;
      case MessageType.SIDE_PANEL_LOADED:
        {
          const url = sender.tab?.url ?? '';

          if (url && new URL(url).origin === 'https://x.com') {
          }

          await chrome.runtime.sendMessage({
            type: MessageType.SHOW_EXPLAINER,
          });
        }
        break;
      default:
        break;
    }
  }
);
