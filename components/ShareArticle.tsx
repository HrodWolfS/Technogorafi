"use client";

import { toast } from "sonner";

export function ShareArticle(props: { url: string; title: string }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(props.url);
      toast.success("Lien copié !");
    } catch {
      toast.error("Erreur lors de la copie du lien");
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    props.title
  )}&url=${encodeURIComponent(props.url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    props.url
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    props.url
  )}`;
  const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(
    props.url
  )}&title=${encodeURIComponent(props.title)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${props.title} ${props.url}`
  )}`;

  return (
    <div className="flex items-center justify-between gap-4 mt-12">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span className="font-bold">Partager</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="bg-zinc-800 hover:bg-zinc-800/90 hover:scale-110 text-white rounded-full p-2 transition-all"
          title="Copier le lien"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1877F2] hover:bg-[#1877F2]/90 hover:scale-110 text-white rounded-full p-2 transition-all"
          title="Partager sur Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black hover:bg-black/90 hover:scale-110 text-white rounded-full p-2 transition-all"
          title="Partager sur X"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M20 4l-6.768 6.768" />
          </svg>
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 hover:scale-110 text-white rounded-full p-2 transition-all"
          title="Partager sur LinkedIn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          href={redditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#FF4500] hover:bg-[#FF4500]/90 hover:scale-110 text-white rounded-full p-2 transition-all"
          title="Partager sur Reddit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="2" />
            <path d="M18.5 10.5c1-.17 1.5.33 1.5 1 0 .67-.67 1.5-2 1.5" />
            <path d="M5.5 10.5c-1-.17-1.5.33-1.5 1 0 .67.67 1.5 2 1.5" />
            <path d="M8.5 14c-.73.87-1.4 1.35-2 1.5" />
            <path d="M15.5 14c.73.87 1.4 1.35 2 1.5" />
            <path d="M11.5 16.5c.73.87 2.4.87 3 0" />
            <path d="M12 20c-3.5 0-6.5-2.5-6.5-5.5C5.5 11 8.5 8 12 8s6.5 3 6.5 6.5c0 3-3 5.5-6.5 5.5Z" />
          </svg>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#25D366]/90 hover:scale-110 text-white rounded-full p-2 transition-all"
          title="Partager sur WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
        </a>
      </div>
    </div>
  );
}
