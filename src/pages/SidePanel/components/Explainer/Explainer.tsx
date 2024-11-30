import React, { FC } from 'react';

import './explainer.css';

export const Explainer: FC = () => {
  return (
    <div className="explainer">
      <div>
        <h3>Social Media Fact Checker!</h3>
        <br />
        <div>
          <p>
            This extension helps you verify social media posts on X using AI.
          </p>
          🤖
          <br />
          <ul>
            <li>
              When you see a post you want to fact-check, click the “Fact Check”
              button.
            </li>
            <li>
              This side panel will open, and generative AI agent will verifying
              the information.
            </li>
          </ul>
          <br />
          <p>🔍 Right now, there's nothing to check.</p>
          <br />
          <p>🐦 Visit a social media site to try it out!</p>
        </div>
      </div>
      <p>
        📝 Note:
        <br />
        If you don’t see the “Fact Check” button next to a post, it means the
        post is not fact-checkable.
      </p>
    </div>
  );
};
