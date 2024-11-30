import { Readability } from '@mozilla/readability';
import { MessageType, SidePanelDataType } from '../../types';

if (new URL(window.location.href).origin === 'https://x.com') {
  console.log('we are on x.com - not doing anything');
} else {
  const documentClone = document.cloneNode(true) as Document;
  const article = new Readability(documentClone).parse();

  chrome.runtime.sendMessage({
    type: MessageType.SET_SIDE_PANEL_DATA,
    dataType: SidePanelDataType.ARTICLE,
    data: article,
  });
}
