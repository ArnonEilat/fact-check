import autoScroll, { escapeWhenUpPlugin } from '@yrobot/auto-scroll';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageType, SidePanelDataType } from '../../types';
import { Explainer } from './components/Explainer/Explainer';
import { Loader } from './components/loader/loader';
import { aiModelNotAvailable, disclaimer, promptIsTooLong } from './disclaimer';
import { composePrompt } from './prompts/prompt';
import { PromptData } from './types';
import { copyHtml } from './utils';

import './SidePanel.css';

const SidePanel = () => {
  const [data, setData] = useState<PromptData>();
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<false | string>('Loading...');
  const [isAiRunning, setIsAiRunning] = useState<boolean>(false);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);

  useEffect(() => {
    const listner = (
      message: any,
      _sender: chrome.runtime.MessageSender,
      _sendResponse: (response?: any) => void
    ) => {
      switch (message.type) {
        case MessageType.SET_SIDE_PANEL_DATA:
          setShowExplainer(false);
          setData({ ...message.data, dataType: message.dataType });
          break;
        case MessageType.SHOW_EXPLAINER:
          setLoading(false);
          setIsAiRunning(false);
          setMarkdown('');
          setData(undefined);
          setShowExplainer(true);
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

    composePrompt(data, (s) => setLoading(s)).then(
      async ({ prompt, systemPrompt }) => {
        console.log('@@@ → prompt, systemPrompt : ', prompt, systemPrompt);

        setLoading('Checking AI language model availability');

        const { available } =
          (await window.ai.languageModel.capabilities()) ?? 'no';

        if (available === 'no') {
          setMarkdown(aiModelNotAvailable);
          setLoading(false);
          return;
        }

        setLoading(
          `Createing AI Model for ${
            data.dataType === SidePanelDataType.ARTICLE ? 'Article' : 'Post'
          }`
        );

        let session;
        try {
          session = await window.ai.languageModel.create({
            systemPrompt,
          });

          // prompt = 'tell me a joke';

          const tokenCount = await session.countPromptTokens(prompt);

          if (tokenCount > session.maxTokens) {
            setLoading(false);
            setIsAiRunning(false);
            setMarkdown(promptIsTooLong(session.maxTokens, tokenCount));
            return;
          }

          setLoading('Start Streaming');
        } catch (error) {
          setLoading('Error creating AI model');
          return;
        }

        const stream = session?.promptStreaming(
          prompt
        ) as ReadableStream<string>;

        let txt = '';
        for await (const chunk of stream as unknown as AsyncIterable<string>) {
          setLoading(false);
          setMarkdown(chunk);
          txt = chunk;
        }

        setMarkdown(txt + disclaimer);
        setIsAiRunning(false);
      }
    );
  }, [data]);

  return (
    <>
      {showExplainer ? (
        <Explainer />
      ) : (
        <>
          <div className="markdown-container">
            {loading && <Loader message={loading} />}
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
          </div>
        </>
      )}
      {!isAiRunning && markdown.length > 0 && (
        <div className="buttons">
          <button onClick={copyHtml}>Copy</button>
          <button onClick={() => navigator.clipboard.writeText(markdown)}>
            Copy Markdown
          </button>
        </div>
      )}
    </>
  );
};

export default SidePanel;
