import { MessageType } from '../../types';
import { delay } from '../../utils';

declare namespace globalThis {
  let chrome: {
    sidePanel: {
      open: (o: any) => Promise<any>;
      setOptions: (o: any) => Promise<any>;
      setPanelBehavior: (o: {
        openPanelOnActionClick: boolean;
      }) => Promise<any>;
    };
  };
}

// Allows users to open the side panel by clicking on the action toolbar icon
globalThis.chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));

chrome.runtime.onMessage.addListener(
  async (message, sender: chrome.runtime.MessageSender) => {
    const tabId = sender?.tab?.id;

    switch (message.type) {
      case MessageType.OPEN_SIDE_PANEL:
        {
          await globalThis.chrome.sidePanel.open({ tabId });
          await globalThis.chrome.sidePanel.setOptions({
            tabId,
            path: 'sidePanel.html',
            enabled: true,
          });

          await delay(500);

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
          const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
          });

          const url = tab.url ?? sender.tab?.url ?? '';

          if (new URL(url).origin === 'https://x.com') {
            chrome.runtime.sendMessage({
              type: MessageType.SET_SIDE_PANEL_MODE,
            });
            return;
          }

          const response = await chrome.tabs.sendMessage(tab.id as number, {
            type: MessageType.BROWSER_ACTION_CLICK,
          });

          const { dataType, data } = response;

          chrome.runtime.sendMessage({
            type: MessageType.SET_SIDE_PANEL_DATA,
            dataType,
            data,
          });
        }
        break;
      default:
        break;
    }
  }
);
