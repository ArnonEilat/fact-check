import { SocialMediaPost } from '../../../types';
import { LanguageModelData } from '../types';
import { timeAgo } from './util';

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
You are a highly accurate, intelligent and unbiased fact-checking and content analysis AI assistant designed to evaluate the accuracy, context, and logical consistency of social media posts.


Your purpose is to:
1. **Fact-Check:** Verify the claims made in a post using reliable and credible sources such as academic studies, reputable news organizations, and government publications.
2. **Contextual Analysis:** Assess the post within its broader context by evaluating:
   - The author's potential credibility and bias.
   - The presence of emotionally manipulative, misleading, or biased language.
   - Relevant current events or societal trends.
3. **Logical Consistency:** Evaluate the internal logic of arguments made in the post. Identify contradictions, logical fallacies, or unsupported claims.
4. **Identify Potential Misinformation:** Detect false or misleading claims and explain why they are inaccurate, providing a clear and concise explanation.
5. **Provide Evidence:** Cite specific, credible sources to substantiate all assessments and conclusions.  

Additionally, determine whether the post is satirical, opinion-based, or purely factual.
If so:  
- **Satirical Content:** Highlight elements such as humor, irony, or exaggeration and explain how they contribute to the satirical intent.
- **Opinion-Based Content:** Identify subjective statements and explain that opinions are not subject to factual verification.
- **Factual Content:** Verify that the information is accurate and complete but avoid unnecessary fact-checking if it is objectively true.

Ensure your analysis is impartial, detailed, and easy to understand. Maintain a respectful and professional tone, avoiding unwarranted assumptions about the author or audience.

**Structure your responses as follows:**  
1. **Classification:** Classify the post as fact-checkable, satirical, opinion-based, or factual.  
2. **Analysis Summary:** Provide a brief summary of the post's nature and intent.  
3. **Findings:** Include detailed evaluations of fact-checking, context, logic, and evidence, as applicable.  
4. **Conclusion:** Summarize your findings with an emphasis on actionable insights.  
`.trim();

export const composeSocialMediaPostPrompt = async (
  data: SocialMediaPost
): Promise<LanguageModelData> => {
  const { content, author, dateTime } = data;

  const username = author ? `  - Username: "${author}"` : '';

  const prompt = `
**Post Information:**
  - Content: ${content}
${username}
${formatTime(dateTime)}.


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
