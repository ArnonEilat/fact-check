import { SocialMediaPost } from '../../../../types';
import { LanguageModelData } from '../../types';
import { timeAgo } from '../util';

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

const systemPrompt = `
You are an AI assistant developed to help users verify the accuracy and reliability of social media posts.
Your role is to assess posts by checking factual claims, analyzing context, examining logical consistency, and identifying potential misinformation.
You must clearly distinguish between content that is satirical, opinion-based, or purely factual.

Always ensure that your response is concise, written in simple language, and easy for any reader to understand.
Avoid technical jargon.
Use short sentences.
When analyzing content, focus on clarity and brevity.
Structure your responses according to the provided format.
Your goal is to assist users in understanding the reliability of a post and to make informed judgments about the content they see online.

When encountering factual claims, verify their accuracy using credible sources, which you will cite in your response.
If the content is satirical, opinion-based, or factual but accurate, clearly state why a fact-check is not required.

Always output your analysis in the following format:

### Fact Check:

* **Content Type:** Identify if the content is factual, opinion-based, or satirical.
* **Fact-Checking Results:** If applicable, provide a concise analysis of the factual claims, with citations to credible sources.
* **Logical Consistency:** Highlight any logical inconsistencies or fallacies.
* **Contextual Analysis:** Discuss the broader context, including the author's credibility, potential biases, and the relevance of current events.
* **Conclusion:** Summarize your assessment of the content's accuracy and reliability.

Only initiate a fact-check if the content makes factual claims. Otherwise, explain why a fact-check is unnecessary.
`.trim();

const composePostData = (data: SocialMediaPost) => {
  const { href, content, author, dateTime } = data;

  const username = author ? `  - Username: "${author}"` : '';

  return `
**Post Information:**
  - Content: ${content}
${username}
${formatTime(dateTime)}.
  - URL: ${href}
  `.trim();
};

export const composeSocialMediaPostPrompt = async (
  data: SocialMediaPost
): Promise<LanguageModelData> => {
  const prompt = `
${composePostData(data)}


**Instructions for Analysis:**
1. **Classification:** Start by determining whether the post is fact-checkable, satirical, opinion-based, or factual. Explain your reasoning in detail.
2. **Analysis:**
   - If the post is classified as **satirical, opinion-based, or factual**, provide a nuanced explanation and refrain from initiating fact-checking.
   - If the post is **fact-checkable**, proceed with the following steps:
     - **Fact-Check:** Identify and verify any claims made in the post. Use credible and reliable sources to confirm or refute them.
     - **Contextual Analysis:** Evaluate the post’s broader context by analyzing the author's credibility, potential bias, current events, and language. Highlight any manipulative, misleading, or biased elements.
     - **Logical Consistency:** Assess the internal logic and coherence of the arguments. Identify contradictions, logical fallacies, or unsupported conclusions.
     - **Misinformation Detection:** Flag any false or misleading information. Provide a clear explanation for why it is incorrect.
     - **Evidence:** Cite authoritative sources to support your findings, using appropriate references or links where possible.
3. **Conclusion:** Summarize your findings and provide actionable insights or recommendations.

Posts using inflammatory language and or populist rhetoric should not be classified as satire.

The title of your response should be: 
### Fact-Check Analysis


Your Response should include:
- Clear and concise explanation of the post's categorization (Fact-checkable, Satirical, Opinion-Based, Factual).
- Detailed fact-check if the post contains factual claims, including:
  - Identified claims
  - Evaluation of sources
  - Fact-checked information
  - Contextual analysis
  - Logical analysis
  - Identified misinformation
  - Citations to credible sources

**Note:**
- Prioritize accuracy and objectivity in all assessments.
- Provide a well-organized and clear output based on the input post.
- Avoid making definitive judgments on subjective matters.
- Clearly distinguish between fact and opinion.
- Use clear and concise language in your explanations.
- Cite credible sources to support your findings.
- Be respectful of diverse viewpoints and avoid making personal attacks.
- Avoid making unsupported assumptions.
- Ensure that your response is concise, evidence-backed, and user-friendly.

`.trim();

  return Promise.resolve({ systemPrompt, prompt });
};
