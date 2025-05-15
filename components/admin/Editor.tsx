"use client";

import { uploadImage } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

export default function Editor({ initialContent = "", onChange }: EditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      const file = acceptedFiles[0];
      const imageUrl = await uploadImage(file);

      // Insérer l'URL de l'image à la position du curseur
      const textArea = document.querySelector("textarea");
      if (textArea) {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const markdownImage = `![${file.name}](${imageUrl})`;
        const newContent =
          content.substring(0, start) + markdownImage + content.substring(end);
        setContent(newContent);
        onChange(newContent);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-[calc(100vh-200px)]">
      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full h-full p-4 font-mono text-sm border rounded resize-none focus:outline-none focus:ring-2"
          placeholder="# Votre article en Markdown..."
        />
        <div
          {...getRootProps()}
          className={`absolute bottom-4 right-4 p-2 rounded border ${
            isDragActive ? "bg-primary/10" : "bg-background"
          } ${isUploading ? "pointer-events-none" : "cursor-pointer"}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="text-sm">Glissez une image ici</span>
          )}
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none p-4 border rounded overflow-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
