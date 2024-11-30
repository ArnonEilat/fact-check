export const copyHtml = () => {
  const content = document.querySelector('.markdown-container')!.innerHTML;
  const blob = new Blob([content], { type: 'text/html' });
  const clipboardItem = new window.ClipboardItem({ 'text/html': blob });

  navigator.clipboard.write([clipboardItem]);
};
