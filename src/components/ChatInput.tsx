"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function ChatInput({ 
  onSubmit, 
  disabled = false, 
  placeholder = "Type your message here...",
  className = ""
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || disabled) return;
      
      onSubmit(input.trim());
      setInput("");
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <textarea
      ref={textareaRef}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`w-full resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none min-h-[48px] max-h-[200px] ${className}`}
      rows={1}
      disabled={disabled}
    />
  );
}
