import { SocialMediaPost } from '../../../../types';
import { LanguageModelData } from '../../types';
import { timeAgo } from '../util';
import { systemPrompt } from './system-prompt';

const formatTime = (dateTime: string) => {
  if (!dateTime) {
    return '';
  }
  try {
    const date = new Date(dateTime);

    const time = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(date);
    return `  - Date and Time: The post was published ${timeAgo(
      date
    )} on ${time}`;
  } catch (error) {
    return '';
  }
};

const createSocialMediaPostData = (data: SocialMediaPost) => {
  const { href, content, author, dateTime } = data;

  const authorInfo = author ? `  - Username: "${author}"` : '';

  return `
**Post Information:**
  - Content: ${content}
${authorInfo}
${formatTime(dateTime)}.
  - URL: ${href}
  `.trim();
};

export const composeSocialMediaPostPrompt = async (
  data: SocialMediaPost
): Promise<LanguageModelData> => {
  const prompt = `
${createSocialMediaPostData(data)}


**Instructions for Analysis:**

Start by determining whether the post's content can be verified.  
If the post's content cannot be verified, explain your reasoning in detail. 

Ensure your output covers at least these aspects:

* Explanation of the classification of the post.  
* Logical consistency and the reasoning of the post  
* Fact Check - As an generative AI agent, you don't have real-time access to external information or the ability to verify claims that are out of your knowledge. Therefore you cannot provide definitive answers on topics that require up-to-the-minute information. However, you can offer general information, insights and other things based on the knowledge you've been trained on.

Posts using sensationalist or inflammatory language and or populist rhetoric should not be classified as satire.


**Note:**

- Prioritize accuracy and objectivity in all assessments.  
- Provide a well-organized and clear output based on the input post.  
- Avoid making definitive judgments on subjective matters.  
- Clearly distinguish between fact and opinion.  
- Use clear and concise language in your explanations.  
- Be respectful of diverse viewpoints and avoid making personal attacks  
- Avoid making unsupported assumptions.  
- Ensure that your response is concise, evidence-backed, and user-friendly.


`.trim();

  return Promise.resolve({ systemPrompt, prompt });
};
