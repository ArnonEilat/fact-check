import { Article, SidePanelDataType, SocialMediaPost } from '../../../types';
import { LanguageModelData, PromptData } from '../types';
import { composeArticlePrompt } from './article/article';
import { composeSocialMediaPostPrompt } from './social-media-post/social-media-post';

export const composePrompt = async (
  data: PromptData,
  update: (msg: string) => void
): Promise<LanguageModelData> => {
  if (!data) {
    return Promise.reject('Invalid data');
  }

  if (data.dataType === SidePanelDataType.ARTICLE) {
    return composeArticlePrompt(data as Article, update);
  }

  return composeSocialMediaPostPrompt(data as SocialMediaPost);
};
