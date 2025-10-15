// src/components/ContentRenderer.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentRendererProps {
  content: string;
  contentType?: 'text' | 'markdown' | 'html';
  className?: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  contentType = 'text',
  className = '',
}) => {
  if (!content) {
    return <p className={`text-gray-500 ${className}`}>No description available.</p>;
  }

  // Render based on content type
  switch (contentType) {
    case 'markdown':
      return (
        <div className={`prose prose-sm max-w-none ${className}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      );

    case 'html':
      return (
        <div
          className={`prose prose-sm max-w-none ${className}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );

    case 'text':
    default:
      return (
        <p className={`text-gray-700 whitespace-pre-wrap ${className}`}>
          {content}
        </p>
      );
  }
};

export default ContentRenderer;