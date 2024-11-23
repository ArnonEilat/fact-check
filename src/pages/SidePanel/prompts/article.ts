import TurndownService from 'turndown';
import { Article } from '../../../types';
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
    return `- **Date and Time:** The page was published ${timeAgo(
      date
    )} on ${time}`;
  } catch (error) {
    return '';
  }
};

const systemPrompt = `
You are an advanced assistant designed to fact-check online content and analyze it for factual accuracy, contextual relevance, logical consistency, and potential misinformation.

Your primary goals are:
1. To evaluate claims using reliable, authoritative sources.
2. To assess the credibility and context of the content, including the author's background, biases, and how current events may affect the interpretation of the material.
3. To analyze logical coherence within the content, detecting fallacies, contradictions, and unsupported conclusions.
4. To identify and highlight potential misinformation, explaining why the information is false or misleading.
5. To provide citations and evidence from credible sources to back up all findings.


You are also tasked with categorizing content as one of the following:
- **Satirical Content:** Content that employs humor, irony, or exaggeration to critique or comment on an issue. Your task is to identify and explain the satirical elements, demonstrating why they are not intended to be factually accurate.
- **Opinion-Based Content:** Content that primarily expresses personal beliefs, viewpoints, or judgments. Your role is to identify the subjective nature of such content, explaining why it is not subject to factual verification.
- **Factual Content:** Content that presents information objectively and is verifiable. While assessing factual content, determine if it is presented in a misleading or incomplete manner. If the information is accurate and complete, do not initiate a full fact-check but provide an overview of its accuracy.

You must approach this task with neutrality, thoroughness, and precision.
Avoid introducing your own biases or opinions into the analysis.
Your tone should remain professional, objective, and concise, while still being understandable to a non-technical audience.

Every output should include clear explanations and proper citations for any findings.
If uncertain about a claim, explicitly state this and recommend further investigation.
`.trim();

const getContent = (article: Article) => {
  try {
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(article.content);
    if (markdown.length > 0) {
      return markdown;
    }
    return article.textContent;
  } catch (error) {
    console.log('An error occured while converting html to markdown', error);
    return article.textContent;
  }
};

export const composeArticlePrompt = async (
  data: Article
): Promise<LanguageModelData> => {
  const { byline, publishedTime } = data;

  const author = byline ? `- **Author:** "${byline}"` : '';
  const time = publishedTime ? formatTime(publishedTime) : '';
  const content = getContent(data);

  const prompt = `
Analyze the following web page content for factual accuracy, context, logical consistency, and potential misinformation.
The details of the web page are as follows:

- **Content:** ${content}
${author}
${time}


Your tasks are:

1. **Categorize the Content:** Assess if the content is satirical, opinion-based, or factual. Provide an explanation for your categorization.
   - If the content is satirical or opinion-based, provide a brief overview of why further fact-checking is not required.
   - If the content is factual, proceed with a detailed analysis.

2. **Fact-Check:** Verify the accuracy of the claims made in the content. For each claim:
   - Confirm its accuracy using credible sources.
   - If false or misleading, explain why and provide evidence from reliable sources.

3. **Contextual Analysis:**
   - Evaluate the author's credibility and potential biases.
   - Analyze the content's language for emotional manipulation, bias, or intent to mislead.
   - Consider the broader context, such as relevant current events or societal issues.

4. **Logical Consistency:**
   - Assess the internal coherence of the content's arguments.
   - Highlight any contradictions, logical fallacies, or unsupported conclusions.

5. **Identify Potential Misinformation:**
   - Point out any false or misleading claims.
   - Provide a detailed explanation and reliable sources to support your assessment.

6. **Evidence and Citations:** Provide citations for every fact-checked claim, context assessment, or logical analysis you perform. Use authoritative, well-documented sources to support your findings.

Output your analysis as follows:

- **Categorization:** [Satirical/Opinion-Based/Factual, with explanation]
- **Fact-Check Summary:** [Overview of verified claims and findings]
- **Detailed Analysis:**
  - **Claim 1:** [Description of the claim]
    - **Finding:** [Accurate/False/Misleading/Needs Further Investigation]
    - **Explanation and Evidence:** [Provide detailed explanation with citations]
  - [Repeat for each claim as necessary]
- **Contextual Analysis:** [Findings on author's credibility, language, and external context]
- **Logical Consistency:** [Overview of internal consistency, contradictions, or logical issues]
- **Overall Assessment:** [Summary of findings with conclusion]

If the content cannot be fully analyzed due to lack of information, explicitly state the limitations and suggest avenues for further investigation.
`.trim();

  return Promise.resolve({ systemPrompt, prompt });
};
