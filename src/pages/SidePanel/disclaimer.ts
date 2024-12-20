export const disclaimer = `
-----
**Disclaimer:**

The information provided by this tool is generated using AI and is based on the analysis of content.

While every effort is made to ensure accuracy and reliability, the tool's assessments and fact-checking results should not be considered definitive or a substitute for professional verification.

Always cross-reference findings with credible sources and exercise critical judgment.
This tool is not responsible for decisions made based on its output.
`;

export const aiModelNotAvailable = `
# Oops! 
AI language model is not available.`;

export const promptIsTooLong = (
  maxTokens: number,
  tokenCount: number
) => `# Oops!
Prompt is too long:

The maximum token count is ${maxTokens} but the prompt has ${tokenCount} tokens.
`;
