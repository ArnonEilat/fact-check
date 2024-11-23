import { Article, SidePanelDataType, SocialMediaPost } from '../../types';

export type PromptData =
  | ((SocialMediaPost | Article) & { dataType: SidePanelDataType })
  | undefined;

export type LanguageModelData = {
  systemPrompt: string;
  prompt: string;
};
