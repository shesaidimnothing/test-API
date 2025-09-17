"use client";

import { motion } from "framer-motion";
import CodeBlock from "./CodeBlock";

interface MessageContentProps {
  content: string;
  className?: string;
}

export default function MessageContent({ content, className = "" }: MessageContentProps) {
  // Fonction pour détecter les blocs de code
  const parseContent = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts: Array<{ type: "text" | "code"; content: string; language?: string }> = [];
    let lastIndex = 0;

    // Trouver tous les blocs de code
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Ajouter le texte avant le bloc de code
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push({ type: "text", content: textBefore });
        }
      }

      // Ajouter le bloc de code
      const language = match[1] || "text";
      const code = match[2].trim();
      parts.push({ type: "code", content: code, language });

      lastIndex = match.index + match[0].length;
    }

    // Ajouter le texte restant
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push({ type: "text", content: remainingText });
      }
    }

    // Si aucun bloc de code n'a été trouvé, traiter le texte normalement
    if (parts.length === 0) {
      parts.push({ type: "text", content: text });
    }

    return parts;
  };

  // Fonction pour formater le texte avec code inline et autres éléments
  const formatTextWithInlineCode = (text: string) => {
    // D'abord traiter les liens, puis le code inline
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(linkRegex);
    
    return parts.map((segment, index) => {
      // Si c'est un lien
      if (index % 3 === 1) {
        const url = parts[index + 1];
        return (
          <a 
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {segment}
          </a>
        );
      }
      
      // Si c'est l'URL d'un lien, on l'ignore car elle est déjà traitée
      if (index % 3 === 2) {
        return null;
      }
      
      // Traiter le code inline dans le texte normal
      return segment.split(/(`[^`]+`)/).map((codeSegment, codeIndex) => {
        if (codeSegment.startsWith('`') && codeSegment.endsWith('`')) {
          return (
            <code 
              key={`${index}-${codeIndex}`}
              className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
            >
              {codeSegment.slice(1, -1)}
            </code>
          );
        }
        return codeSegment;
      });
    }).filter(Boolean);
  };


  const contentParts = parseContent(content);

  return (
    <div className={`space-y-4 ${className}`}>
      {contentParts.map((part, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          {part.type === "code" ? (
            <CodeBlock 
              code={part.content} 
              language={part.language} 
              className="my-4"
            />
          ) : (
            <div className="prose prose-sm max-w-none">
              {part.content.split('\n').map((line, lineIndex) => {
                // Détecter les listes
                const isListItem = /^[\s]*[-*+]\s/.test(line) || /^[\s]*\d+\.\s/.test(line);
                const isNumberedList = /^[\s]*\d+\.\s/.test(line);
                
                if (isListItem) {
                  const content = line.replace(/^[\s]*[-*+]\s/, '').replace(/^[\s]*\d+\.\s/, '');
                  return (
                    <div key={lineIndex} className={`ml-4 ${isNumberedList ? 'list-decimal' : 'list-disc'} list-inside`}>
                      <li className="mb-1">
                        {formatTextWithInlineCode(content)}
                      </li>
                    </div>
                  );
                }
                
                // Détecter les titres
                if (line.startsWith('#')) {
                  const level = line.match(/^#+/)?.[0].length || 1;
                  const text = line.replace(/^#+\s*/, '');
                  const headingLevel = Math.min(level, 6);
                  
                  const className = `font-bold text-gray-900 dark:text-gray-100 mb-2 mt-4 ${
                    level === 1 ? 'text-xl' : 
                    level === 2 ? 'text-lg' : 
                    level === 3 ? 'text-base' : 'text-sm'
                  }`;
                  
                  if (headingLevel === 1) {
                    return <h1 key={lineIndex} className={className}>{formatTextWithInlineCode(text)}</h1>;
                  } else if (headingLevel === 2) {
                    return <h2 key={lineIndex} className={className}>{formatTextWithInlineCode(text)}</h2>;
                  } else if (headingLevel === 3) {
                    return <h3 key={lineIndex} className={className}>{formatTextWithInlineCode(text)}</h3>;
                  } else if (headingLevel === 4) {
                    return <h4 key={lineIndex} className={className}>{formatTextWithInlineCode(text)}</h4>;
                  } else if (headingLevel === 5) {
                    return <h5 key={lineIndex} className={className}>{formatTextWithInlineCode(text)}</h5>;
                  } else {
                    return <h6 key={lineIndex} className={className}>{formatTextWithInlineCode(text)}</h6>;
                  }
                }
                
                // Détecter les citations
                if (line.startsWith('>')) {
                  const text = line.replace(/^>\s*/, '');
                  return (
                    <blockquote key={lineIndex} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-2 bg-gray-50 dark:bg-gray-800 rounded-r">
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        {formatTextWithInlineCode(text)}
                      </p>
                    </blockquote>
                  );
                }
                
                // Texte normal
                if (line.trim()) {
                  return (
                    <p key={lineIndex} className="mb-2 last:mb-0">
                      {formatTextWithInlineCode(line)}
                    </p>
                  );
                }
                
                // Ligne vide
                return <br key={lineIndex} />;
              })}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
