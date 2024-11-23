import autoScroll, { escapeWhenUpPlugin } from '@yrobot/auto-scroll';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageType, SidePanelDataType } from '../../types';
import { Loader } from './components/loader/loader';
import { disclaimer } from './disclaimer';
import { composePrompt } from './prompts/prompt';
import { PromptData } from './types';

import './SidePanel.css';
import { TwitterExplainer } from './components/twitter-explainer/twitter-explainer';

declare namespace globalThis {
  let ai: {
    languageModel: {
      create: (args: {
        // monitor: (m: any) => void;
        systemPrompt: string;
      }) => Promise<any>;
      capabilities: () => Promise<{ available: string }>;
    };
  };
}

const copyHtml = () => {
  const content = document.querySelector('.markdown-container')!.innerHTML;
  const blob = new Blob([content], { type: 'text/html' });
  const clipboardItem = new window.ClipboardItem({
    'text/html': blob,
  });
  navigator.clipboard.write([clipboardItem]);
};

const SidePanel = () => {
  const [data, setData] = useState<PromptData>();
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<false | string>('Loading...');
  const [isAiRunning, setIsAiRunning] = useState<boolean>(false);
  const [showTwitterExplainer, setShowTwitterExplainer] =
    useState<boolean>(false);

  useEffect(() => {
    const listner = (
      message: any,
      _sender: chrome.runtime.MessageSender,
      _sendResponse: (response?: any) => void
    ) => {
      switch (message.type) {
        case MessageType.SET_SIDE_PANEL_DATA:
          setShowTwitterExplainer(false);
          setData({ ...message.data, dataType: message.dataType });
          break;
        case MessageType.SET_SIDE_PANEL_MODE:
          setLoading(false);
          setIsAiRunning(false);
          setMarkdown('');
          setData(undefined);
          setShowTwitterExplainer(true);
          break;
        default:
          break;
      }
    };

    chrome.runtime.onMessage.addListener(listner);

    chrome.runtime.sendMessage({ type: MessageType.SIDE_PANEL_LOADED });

    autoScroll({ selector: '#app-container', plugins: [escapeWhenUpPlugin()] });

    return () => chrome.runtime.onMessage.removeListener(listner);
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    setMarkdown('');
    setLoading('Initializing AI');
    setIsAiRunning(true);

    composePrompt(data).then(async ({ prompt, systemPrompt }) => {
      const { available } =
        (await globalThis.ai.languageModel.capabilities()) ?? 'no';

      if (available === 'no') {
        setMarkdown(`
# Oops! 
AI language model is not available`);
        setLoading(false);
        return;
      }

      setLoading(
        `Createing AI Model for ${
          data.dataType === SidePanelDataType.ARTICLE ? 'Article' : 'Post'
        }`
      );

      const session = await globalThis.ai.languageModel.create({
        systemPrompt,
      });

      const stream = session.promptStreaming(prompt);
      setLoading('Start Streaming');

      let txt = '';
      for await (const chunk of stream) {
        setLoading(false);
        setMarkdown(chunk);
        txt = chunk;
      }

      setIsAiRunning(false);
      setMarkdown(txt + disclaimer);
    });
  }, [data]);

  return (
    <div className="App">
      {!isAiRunning && markdown.length > 0 && (
        <div className="buttons">
          <button onClick={copyHtml}>Copy</button>
          <button onClick={() => navigator.clipboard.writeText(markdown)}>
            Copy Markdown
          </button>
        </div>
      )}
      {showTwitterExplainer && <TwitterExplainer />}
      <div className="markdown-container">
        {loading && <Loader message={loading} />}
        <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
      </div>
    </div>
  );
};

export default SidePanel;
