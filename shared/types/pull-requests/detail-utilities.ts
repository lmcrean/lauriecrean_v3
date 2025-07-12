// Detail-specific utilities for pull request detail card
import { DetailedPullRequestData } from './index';

export const shareData = async (pullRequest: DetailedPullRequestData): Promise<void> => {
  const shareData = {
    title: `PR #${pullRequest.number}: ${pullRequest.title}`,
    text: `Check out this pull request by ${pullRequest.author.login}`,
    url: pullRequest.html_url
  };

  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    await copyToClipboard(pullRequest.html_url);
  }
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}; 