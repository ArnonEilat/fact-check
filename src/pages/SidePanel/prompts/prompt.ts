import { Article, SidePanelDataType, SocialMediaPost } from '../../../types';
import { LanguageModelData, PromptData } from '../types';
import { composeSocialMediaPostPrompt } from './social-media-post';
import { composeArticlePrompt } from './article';

export const composePrompt = async (
  data: PromptData
): Promise<LanguageModelData> => {
  if (!data) {
    return Promise.reject('Invalid data');
  }

  if (data.dataType === SidePanelDataType.ARTICLE) {
    return composeArticlePrompt(data as Article);
  }

  return composeSocialMediaPostPrompt(data as SocialMediaPost);
};
