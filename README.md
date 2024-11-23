# Fact-Check AI Chrome Extension

## Overview

In an era where misinformation and "fake news" run rampant online, the need for improved digital literacy and critical thinking skills has never been more pressing. \
Fact-Check AI is an experimental Chrome extension designed to address this need by harnessing the power of generative AI to assess the accuracy of online content. \
Fact-Check AI empowers users to critically assess online information, combating misinformation and promoting digital literacy. \
By identifying and flagging potential misinformation, the extension helps curb the spread of false narratives and fosters a more informed citizenry. \
Additionally, it enhances trust and transparency by providing context around claims.

#### Disclaimer:

Fact-Check AI is an experimental tool and may not always be 100% accurate. \
It is intended to be used as a supplement to, not a replacement for, critical thinking and independent research. \
**Remember:** \
Always verify information from multiple sources and consult with experts when in doubt.

## Usage

1. Open a webpage in Chrome.
2. Click on the Fact-Check AI extension icon in the toolbar

## How It Works

1. **Content Extraction:** \
   The extension extracts the main content of the webpage.
2. **Fact-Checking:** \
   If applicable, the extension:
   - Uses generative AI to analyze claims.
   - Verifies claims.
   - Reports findings with clear explanations.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/ArnonEilat/fact-check.git
   ```
2. Navigate to the project directory:
   ```bash
   cd fact-check-ai-extension
   ```
3. Build the project (if applicable):
   ```bash
   npm install
   npm run build
   ```
4. Load the extension into Chrome:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable **Developer mode** in the top-right corner.
   - Click **Load unpacked** and select the `build` directory.
