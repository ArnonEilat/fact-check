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
            This extension helps you verify social media posts on Facebook and X
            using AI. 🤖
          </p>
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
      {/* 🔍✅ with 🤖: Our 🤖 tool helps verify ℹ️ on 📱 posts.

🛠️ How It Works:

Click the 🔍✅ button on posts from 📘 or 🐦.

A side panel will open and analyze the 📝 for ✅.

❓ Why Use This: Stay informed and get accurate ℹ️ about what you 📖 online.

📝 Note: You need to be on 📘 or 🐦 for the 🔍✅ button to appear. If you don't see the 🔍✅ button next to a post, it means the post is not fact-checkable. */}
      {/* This extension is here to make it super easy for you to check if social
      media posts are accurate or not.
      <br />
      If you come across a post on Facebook or Twitter that feels a bit sketchy,
      just hit the "Fact Check" button.
      <br />
      Our AI will do the work for you and give you a quick rundown in this side
      panel.
      <br />
      Right now, there's nothing for us to check.
      <br />
      To start, just head over to Facebook or Twitter, find a post you'd like to
      verify, and click that "Fact Check" button to see it in action! And if you
      don’t see the button, it just means the post isn't one we can fact-check. */}
      {/* 
      This extension is here to help you quickly verify the accuracy of social
      media content.
      <br />
      When you see a post on Facebook or Twitter that seems questionable, just
      click the "Fact Check" button.
      <br />
      Our AI will analyze the information and provide an overview, right here in
      the side panel.
      <br />
      Currently, there's no content for us to verify.
      <br />
      To get started, visit Facebook or Twitter, find a post that you'd like to
      verify, and click the "Fact Check" button to see how it works!
      <br />
      <br />
      <br />
      If you don't see the "Fact Check" button, it's because the post is not
      fact-checkable. */}
    </div>
  );
};
