export type SocialMediaPost = {
  content: string;
  author: string;
  dateTime: string;
};

export type Article = {
  /** article title */
  title: string;
  /** HTML string of processed article content */
  content: string;
  /** text content of the article, with all the HTML tags removed */
  textContent: string;
  /** length of an article, in characters */
  length: number;
  /** article description, or short excerpt from the content */
  excerpt: string;
  /** author metadata */
  byline: string;
  /** content direction */
  dir: string;
  /** name of the site */
  siteName: string;
  /** content language */
  lang: string;
  /** published time */
  publishedTime: string;
};

export enum MessageType {
  OPEN_SIDE_PANEL = 'open-side-panel',
  SIDE_PANEL_LOADED = 'side-panel-loaded',
  SET_SIDE_PANEL_DATA = 'set-side-panel-data',
  SET_SIDE_PANEL_MODE = 'set-side-panel-mode',
  BROWSER_ACTION_CLICK = 'browser-action-click',
  SET_ARTICLE = 'set-article',
}

export enum SidePanelDataType {
  SOCIAL_MEDIA_POST = 'social-media-post',
  ARTICLE = 'article',
}
