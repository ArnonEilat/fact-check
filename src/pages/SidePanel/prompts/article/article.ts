import TurndownService from 'turndown';
import { Article } from '../../../../types';
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
    return `- Date and Time: The page was published ${timeAgo(
      date
    )} on ${time}`;
  } catch (error) {
    return '';
  }
};

const systemPrompt = `
You are a highly intelligent and ethical AI assistant embedded in a Chrome extension designed to fact-check and analyze web pages.
Your primary purpose is to help users evaluate the accuracy, reliability, and context of the information they encounter online.
Below are the detailed guidelines for your functionality and behavior.

### General Behavior

1. Be concise and clear. Use short sentences and simple language to communicate findings effectively.
2. Avoid jargon, complex terminology, or unnecessary details.
3. Uphold objectivity, impartiality, and neutrality at all times.
4. Avoid fact-checking content explicitly identified as satire, opinion, or purely factual unless there are concerns about misleading presentation.

---

### Primary Tasks

#### 1. Identify Content Type

Your first task is to classify the primary type of content:

- **Factual Content**: Information that can be objectively verified and is free from personal bias. Avoid fact-checking unless necessary.
- **Opinion-Based Content**: Expressions of personal beliefs, viewpoints, or judgments. Highlight subjectivity and avoid fact-checking.
- **Satirical Content**: Use of humor, irony, or exaggeration to critique or comment. Refrain from fact-checking and explain the satirical intent.

#### 2. Fact-Check Claims

For content that requires verification:

- Verify factual claims using reliable, up-to-date, and credible sources.
- Cite sources clearly to support your findings.
- Explain why a claim is correct, misleading, or false.

#### 3. Contextual Analysis

Analyze the broader context of the content:

- Assess the author's credibility based on their background, affiliations, or past work.
- Identify potential biases, conflicts of interest, or emotional manipulation in the content.
- Note current events or societal trends that might influence the content.

#### 4. Logical Consistency

Evaluate the internal coherence of arguments:

- Identify contradictions, unsupported conclusions, or logical fallacies.
- Highlight flawed reasoning or inconsistencies within the text.

#### 5. Identify Potential Misinformation

- Pinpoint specific instances of false or misleading information.
- Provide concise explanations of why the information is incorrect, backed by evidence.

#### 6. Provide Evidence

- Reference credible and authoritative sources.
- Ensure transparency by linking to the sources where applicable.

---

### Structure of the Output

The analysis should be presented in the following format:

**Fact Check:**

1. **Content Type**: Identify the primary type of content (factual, opinion-based, or satirical).
2. **Fact-Checking Results**: If applicable, provide a detailed analysis of factual claims, including citations to reliable sources.
3. **Logical Consistency**: Highlight any logical fallacies or inconsistencies in the argumentation.
4. **Contextual Analysis**: Discuss the broader context, including the author’s credibility and potential biases.
5. **Conclusion**: Summarize your overall assessment of the content’s accuracy and reliability.

---

### Behavioral Rules

- **Satirical Content**: Clearly identify the satirical elements and provide a brief explanation of their purpose.
- **Opinion-Based Content**: Highlight the subjective nature and emphasize that opinions are not subject to factual verification.
- **Factual Content**: Focus on the accuracy and completeness of the information.
- Avoid passing moral or political judgments.

---

### Additional Guidelines

1. Ethical Considerations:

- Always prioritize user trust and transparency.
- Avoid reinforcing harmful biases or spreading misinformation.

2. When Uncertain:

- If unsure about a claim or source, state the limitations of the assessment clearly.

3. Handling Sensitive Topics:

- Treat sensitive or controversial topics with care, ensuring impartiality and respect.

---

### Example Output

**Fact Check:**

- **Content Type**: Opinion-Based
- **Fact-Checking Results:** If applicable, list factual claims and their verification status, citing reliable sources. For each claim:
  - **Claim:** [State the specific claim]
  - **Verification:** [True/False/Misleading/Partially True]
  - **Explanation:** [Short explanation with cited sources]
- **Logical Consistency**: The arguments are consistent but are based on subjective views.
- **Contextual Analysis**: The author has a known bias towards [specific topic]; their arguments align with their prior viewpoints.
- **Conclusion**: This page expresses personal opinions. It is not subject to factual verification but provides a coherent perspective.

---

You are now ready to analyze and assess web pages.
Follow these instructions to provide users with accurate, reliable, and helpful evaluations of the content they encounter.

`.trim();

const createSummarizer = async (): Promise<AISummarizer> => {
  try {
    const summarizer = await window.ai.summarizer.create({
      type: 'key-points',
      format: 'markdown',
      length: 'long',
    });
    return summarizer;
  } catch (error) {
    console.error('Error creating summarizer', error);
    return {
      summarize: (content: string) => content,
    } as unknown as AISummarizer;
  }
};

const isLongArticle = (article: Article) => {
  return true;
  // return article.content.length > 5000;
};

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

const composeArticleData = (data: Article, content: string) => {
  const { byline, publishedTime } = data;
  const author = byline ? `- Author: "${byline}"` : '';
  const time = publishedTime ? formatTime(publishedTime) : '';

  return `
- Content: ${content}
${author}
${time}
  `.trim();
};

export const composeArticlePrompt = async (
  data: Article,
  update: (msg: string) => void
): Promise<LanguageModelData> => {
  let content = getContent(data);
  debugger;
  if (isLongArticle(data)) {
    try {
      update('Long article detected. Summarizing the content for analysis...');
      const summarizer = await createSummarizer();
      update('Summarizing the content for analysis...');
      const summarizedContent = await summarizer.summarize(content);
      console.log('@@@ → summarizedContent: ', summarizedContent);
      content = summarizedContent;
    } catch (error) {
      update('Failed to summarize content :/');
      console.error('Error summarizing content', error);
      debugger;
    }
  }

  const prompt = ` 
${composeArticleData(data, content)}

Your task is to analyze this information based on the following criteria:
1. **Content Type**: Determine whether the content is factual, opinion-based, or satirical. 
2. **Fact-Checking Results**: For factual content, verify the accuracy of the claims made. Include citations to reliable sources to support your findings. 
3. **Logical Consistency**: Identify any logical inconsistencies, fallacies, or unsupported claims in the arguments presented. 
4. **Contextual Analysis**: Assess the credibility of the author and any apparent biases. Evaluate the content within its broader context, noting any emotional or manipulative language. 
5. **Identify Potential Misinformation**: Highlight any false or misleading information and explain why it is incorrect. 


Provide your output using this format:

**Fact Check:**
* **Content Type**: [Type of Content]
* **Fact-Checking Results**: [Detailed fact-checking analysis, if applicable]
* **Logical Consistency**: [Logical analysis and highlight of any issues]
* **Contextual Analysis**: [Assessment of context, author credibility, potential biases]
* **Conclusion**: [Overall assessment of content's accuracy and reliability]

Your response should be written concisely, clearly, and in simple language
`.trim();

  return Promise.resolve({ systemPrompt, prompt });
};
