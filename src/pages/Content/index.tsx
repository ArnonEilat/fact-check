import { MessageType, SocialMediaPost, SidePanelDataType } from '../../types';

const targetNode = document.querySelector('[role="main"]') as Element;

// Options for the observer (which mutations to observe)
const config: MutationObserverInit = {
  attributes: true,
  childList: true,
  subtree: true,
};

// Callback function to execute when mutations are observed
const callback = async (_mutationList: any, _observer: any) => {
  const posts = document.querySelectorAll('[data-testid="tweet"]');

  posts.forEach((post) => {
    if (post.querySelector('.fc-btn')) {
      return;
    }

    if ((post?.textContent?.length as number) < 150) {
      return;
    }

    const btn = document.createElement('button');
    btn.classList.add('fc-btn');
    btn.textContent = 'Fact Check';

    btn.addEventListener('click', async () => {
      const content = post.querySelector(
        '[data-testid="tweetText"]'
      )?.textContent;

      console.log(post.querySelector('[data-testid="tweetText"]'));

      if (!content) {
        return;
      }

      const author = (
        post.querySelector('[data-testid="User-Name"] a') as HTMLAnchorElement
      )?.href?.replace('https://x.com/', '');

      const dateTime =
        post.querySelector('time')?.getAttribute('datetime') ?? '';

      const data = {
        content,
        author,
        dateTime,
        href: window.location.href,
      } as SocialMediaPost;

      chrome.runtime.sendMessage({
        type: MessageType.OPEN_SIDE_PANEL,
        dataType: SidePanelDataType.SOCIAL_MEDIA_POST,
        data,
      });
    });

    post.appendChild(btn);
  });
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

if (targetNode) {
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}
