import React from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
  PinterestShareButton,
  PinterestIcon,
  TelegramShareButton,
  TelegramIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon,
  TumblrShareButton,
  TumblrIcon,
  PocketShareButton,
  PocketIcon,
} from 'next-share';

interface ShareMeta {
  url?: string;
  title?: string;
  summary?: string;
  image?: string;
}

interface SocialShareGridProps {
  meta?: ShareMeta;
  size?: number;
  round?: boolean;
  platforms?: string[];
  showName?: boolean;
}

const DEFAULT_PLATFORMS = [
  'facebook',
  'twitter',
  'linkedin',
  'whatsapp',
  'pinterest',
  'telegram',
  'reddit',
  'tumblr',
  'email',
  'pocket',
];

export default function SocialShareGrid({ 
  meta = {}, 
  size = 44, 
  round = true, 
  platforms,
  showName = false
}: SocialShareGridProps) {
  const { 
    url = typeof window !== 'undefined' ? window.location.href : '', 
    title = '', 
    summary = '', 
    image = '' 
  } = meta;
  
  const show = platforms && platforms.length 
    ? platforms.map(p => p.toLowerCase()) 
    : DEFAULT_PLATFORMS;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    } catch (e) {
      console.error('Copy failed', e);
      alert('Could not copy link');
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        {show.includes('facebook') && (
          <div className="flex flex-col items-center text-sm">
            <FacebookShareButton url={url} quote={summary} hashtag="#share">
              <FacebookIcon size={size} round={round} />
            </FacebookShareButton>
            {showName && <span className="mt-1">Facebook</span>}
          </div>
        )}

        {show.includes('twitter') && (
          <div className="flex flex-col items-center text-sm">
            <TwitterShareButton url={url} title={title}>
              <TwitterIcon size={size} round={round} />
            </TwitterShareButton>
            {showName && <span className="mt-1">Twitter</span>}
          </div>
        )}

        {show.includes('linkedin') && (
          <div className="flex flex-col items-center text-sm">
            <LinkedinShareButton url={url} title={title} summary={summary} source={url}>
              <LinkedinIcon size={size} round={round} />
            </LinkedinShareButton>
            {showName && <span className="mt-1">LinkedIn</span>}
          </div>
        )}

        {show.includes('whatsapp') && (
          <div className="flex flex-col items-center text-sm">
            <WhatsappShareButton url={url} title={title} separator=" - ">
              <WhatsappIcon size={size} round={round} />
            </WhatsappShareButton>
            {showName && <span className="mt-1">WhatsApp</span>}
          </div>
        )}

        {show.includes('pinterest') && (
          <div className="flex flex-col items-center text-sm">
            <PinterestShareButton url={url} media={image} description={summary}>
              <PinterestIcon size={size} round={round} />
            </PinterestShareButton>
            {showName && <span className="mt-1">Pinterest</span>}
          </div>
        )}

        {show.includes('telegram') && (
          <div className="flex flex-col items-center text-sm">
            <TelegramShareButton url={url} title={title}>
              <TelegramIcon size={size} round={round} />
            </TelegramShareButton>
            {showName && <span className="mt-1">Telegram</span>}
          </div>
        )}

        {show.includes('reddit') && (
          <div className="flex flex-col items-center text-sm">
            <RedditShareButton url={url} title={title}>
              <RedditIcon size={size} round={round} />
            </RedditShareButton>
            {showName && <span className="mt-1">Reddit</span>}
          </div>
        )}

        {show.includes('tumblr') && (
          <div className="flex flex-col items-center text-sm">
            <TumblrShareButton url={url} title={title}>
              <TumblrIcon size={size} round={round} />
            </TumblrShareButton>
            {showName && <span className="mt-1">Tumblr</span>}
          </div>
        )}

        {show.includes('email') && (
          <div className="flex flex-col items-center text-sm">
            <EmailShareButton url={url} subject={title} body={summary}>
              <EmailIcon size={size} round={round} />
            </EmailShareButton>
            {showName && <span className="mt-1">Email</span>}
          </div>
        )}

        {show.includes('pocket') && (
          <div className="flex flex-col items-center text-sm">
            <PocketShareButton url={url} title={title}>
              <PocketIcon size={size} round={round} />
            </PocketShareButton>
            {showName && <span className="mt-1">Pocket</span>}
          </div>
        )}

        <div className="flex flex-col items-center text-sm">
          <button
            onClick={copyToClipboard}
            className="flex flex-col items-center justify-center w-full h-full"
            aria-label="Copy link"
          >
            <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-link">
                <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 6.93" />
                <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.41a5 5 0 0 0 7.07 7.07L14 17.07" />
              </svg>
            </div>
            {showName && <span className="mt-1">Copy</span>}
          </button>
        </div>
      </div>
    </div>
  );
}