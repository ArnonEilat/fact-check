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

chrome.action.onClicked.addListener(async (tab) => {
  await globalThis.chrome.sidePanel.open({
    tabId: tab.id as number,
  });

  await globalThis.chrome.sidePanel.setOptions({
    tabId: tab.id as number,
    path: 'sidePanel.html',
    enabled: true,
  });

  await delay(200);

  await chrome.scripting.executeScript({
    target: { tabId: tab.id as number },
    files: ['contentScraper.bundle.js'],
  });
});

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
          // const [tab] = await chrome.tabs.query({
          //   active: true,
          //   lastFocusedWindow: true,
          // });

          const url = sender.tab?.url ?? '';

          // await globalThis.chrome.sidePanel.setOptions({
          //   tabId,
          // });
          // await chrome.scripting.executeScript({
          //   target: { tabId: tab.id as number },
          //   files: ['contentScraper.bundle.js'],
          // });

          if (url && new URL(url).origin === 'https://x.com') {
            await chrome.runtime.sendMessage({
              type: MessageType.SET_SIDE_PANEL_MODE,
            });
            return;
          }
        }
        break;
      default:
        break;
    }
  }
);
