"use client";

import { useState } from "react";
import { SocialIcon } from "react-social-icons";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Lien copié dans le presse-papiers !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erreur lors de la copie du lien");
    }
  };

  // 🔹 URLs correctement formatées pour chaque réseau
  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      title
    )}%20${encodeURIComponent(url)}`,
    reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
  };

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-2">Partager cet article</h3>
      <div className="flex gap-2">
        {/* 🔹 Twitter */}
        <SocialIcon
          url={socialLinks.twitter}
          network="twitter"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          style={{ width: 32, height: 32 }}
        />

        {/* 🔹 Facebook */}
        <SocialIcon
          url={socialLinks.facebook}
          network="facebook"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          style={{ width: 32, height: 32 }}
        />

        {/* 🔹 LinkedIn */}
        <SocialIcon
          url={socialLinks.linkedin}
          network="linkedin"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          style={{ width: 32, height: 32 }}
        />

        {/* 🔹 WhatsApp */}
        <SocialIcon
          url={socialLinks.whatsapp}
          network="whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          style={{ width: 32, height: 32 }}
        />

        {/* 🔹 Reddit */}
        <SocialIcon
          url={socialLinks.reddit}
          network="reddit"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300"
          style={{ width: 32, height: 32 }}
        />

        {/* 🔹 Bouton Copier le lien */}
        <button
          onClick={handleCopyLink}
          className={`p-2 rounded-full border border-border hover:scale-110 transition-transform duration-300 ${
            copied ? "bg-primary text-primary-foreground" : ""
          }`}
          aria-label="Copier le lien"
          title="Copier le lien"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </div>
    </div>
  );
}
