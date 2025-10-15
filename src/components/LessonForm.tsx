// src/components/LessonForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import type { Lesson } from '../types';
import Button from './Button';
import FormInput from './FormInput';
import { Link as LinkIcon, Upload, Eye, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LessonFormProps {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Lesson | null;
}

const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, onCancel, isLoading, initialData }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    order: initialData?.order || 1,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [videoInputType, setVideoInputType] = useState<'upload' | 'link'>('upload');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [contentFormat, setContentFormat] = useState<'markdown' | 'html' | 'plain'>('markdown');
  //const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        order: initialData.order,
      });
      if (initialData.videoUrl && initialData.videoType === 'link') {
        setVideoInputType('link');
        setVideoLink(initialData.videoUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoLink('');
      if (errors.video) {
        setErrors(prev => ({ ...prev, video: '' }));
      }
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setVideoLink(link);
    setVideoFile(null);
    if (errors.video) {
      setErrors(prev => ({ ...prev, video: '' }));
    }
  };

  const insertMarkdown = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end) || 'text';
    const beforeText = formData.content.substring(0, start);
    const afterText = formData.content.substring(end);

    const newContent = beforeText + before + selectedText + after + afterText;
    setFormData(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (formData.order < 1) {
      newErrors.order = 'Order must be at least 1';
    }

    if (!initialData) {
      if (videoInputType === 'upload' && !videoFile) {
        newErrors.video = 'Please upload a video file';
      }
      if (videoInputType === 'link' && !videoLink.trim()) {
        newErrors.video = 'Please provide a video link';
      }
      if (videoInputType === 'link' && videoLink.trim() && !isValidUrl(videoLink)) {
        newErrors.video = 'Please provide a valid video URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('order', formData.order.toString());

    if (videoInputType === 'upload' && videoFile) {
      data.append('video', videoFile);
    } else if (videoInputType === 'link' && videoLink.trim()) {
      data.append('videoLink', videoLink.trim());
    }

    console.log('Submitting FormData:');
    for (const pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    onSubmit(data);
  };

  const renderPreview = () => {
    if (contentFormat === 'markdown') {
      return (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
              h2: ({...props}) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
              h3: ({...props}) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
              p: ({...props}) => <p className="mb-2" {...props} />,
              ul: ({...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
              ol: ({...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
              li: ({...props}) => <li className="ml-2" {...props} />,
              strong: ({...props}) => <strong className="font-bold" {...props} />,
              em: ({...props}) => <em className="italic" {...props} />,
              code: ({...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />,
              pre: ({...props}) => <pre className="bg-gray-100 p-3 rounded mb-2 overflow-auto" {...props} />,
              blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
              a: ({...props}) => <a className="text-blue-600 underline hover:text-blue-800" {...props} />,
            }}
          >
            {formData.content}
          </ReactMarkdown>
        </div>
      );
    } else if (contentFormat === 'html') {
      return (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: formData.content }}
        />
      );
    } else {
      // Plain text
      return (
        <div className="whitespace-pre-wrap text-gray-800">
          {formData.content}
        </div>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormInput
        label="Lesson Title"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Introduction to React"
        required
        error={errors.title}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
            Lesson Description
          </label>
          <div className="flex gap-2">
            <select
              value={contentFormat}
              onChange={(e) => setContentFormat(e.target.value as 'markdown' | 'html' | 'plain')}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white"
            >
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
              <option value="plain">Plain Text</option>
            </select>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-1 text-xs px-3 py-1 rounded transition ${
                previewMode
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {previewMode ? (
                <>
                  <Code className="h-3 w-3" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" />
                  Preview
                </>
              )}
            </button>
          </div>
        </div>

        {!previewMode ? (
          <div>
            {/* Toolbar */}
            {contentFormat === 'markdown' && (
              <div className="mb-0 p-2 bg-gray-50 border border-b-0 border-gray-300 rounded-t-lg flex flex-wrap gap-1 items-center">
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**')}
                  title="Bold"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-sm font-bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*')}
                  title="Italic"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-sm italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('~~', '~~')}
                  title="Strikethrough"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-sm line-through"
                >
                  S
                </button>
                <div className="border-l border-gray-300 h-6"></div>
                <button
                  type="button"
                  onClick={() => insertMarkdown('# ', '\n')}
                  title="Heading 1"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs font-bold"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('## ', '\n')}
                  title="Heading 2"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs font-bold"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('### ', '\n')}
                  title="Heading 3"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs font-bold"
                >
                  H3
                </button>
                <div className="border-l border-gray-300 h-6"></div>
                <button
                  type="button"
                  onClick={() => insertMarkdown('- ', '\n')}
                  title="Bullet List"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs whitespace-nowrap"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('1. ', '\n')}
                  title="Numbered List"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs whitespace-nowrap"
                >
                  1. List
                </button>
                <div className="border-l border-gray-300 h-6"></div>
                <button
                  type="button"
                  onClick={() => insertMarkdown('[', '](url)')}
                  title="Link"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs"
                >
                  Link
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('`', '`')}
                  title="Code"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs font-mono"
                >
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('```\n', '\n```')}
                  title="Code Block"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs"
                >
                  Block
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('> ', '\n')}
                  title="Quote"
                  className="px-2.5 py-1.5 hover:bg-gray-200 rounded transition text-xs"
                >
                  Quote
                </button>
              </div>
            )}

            <textarea
              ref={textareaRef}
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder={
                contentFormat === 'markdown' 
                  ? "# Heading\n\n**Bold text**\n\n- List item\n\n[Link](url)"
                  : contentFormat === 'html'
                  ? "<h2>Heading</h2>\n<p>Paragraph text</p>"
                  : "Enter your plain text content here..."
              }
              required
              rows={12}
              className={`block w-full px-4 py-2 border shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 font-mono text-sm resize-none ${
                contentFormat === 'markdown' ? 'rounded-b-lg' : 'rounded-lg'
              } ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500 mt-2">
              {contentFormat === 'markdown'
                ? 'Use the toolbar or markdown syntax for formatting'
                : contentFormat === 'html'
                ? 'Write valid HTML content'
                : 'Plain text with no formatting'}
            </p>
          </div>
        ) : (
          <div className={`border rounded-lg p-4 bg-gray-50 transition-all duration-300 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}>
            <div>
              {formData.content ? renderPreview() : <p className="text-gray-400">Preview will appear here...</p>}
            </div>
          </div>
        )}

        {errors.content && <p className="text-sm text-red-500 mt-1 font-medium">{errors.content}</p>}
      </div>

      <FormInput
        label="Lesson Order"
        type="number"
        name="order"
        value={formData.order}
        onChange={handleChange}
        min={1}
        required
        error={errors.order}
      />

      {/* Video Input Type Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Video Source {initialData && '(Optional - leave empty to keep current video)'}
        </label>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              setVideoInputType('upload');
              setVideoLink('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              videoInputType === 'upload'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload Video
          </button>
          <button
            type="button"
            onClick={() => {
              setVideoInputType('link');
              setVideoFile(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              videoInputType === 'link'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            Video Link
          </button>
        </div>

        {videoInputType === 'upload' && (
          <div>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.video ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {videoFile && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Selected: <span className="font-medium">{videoFile.name}</span>
                  <span className="text-gray-500">({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </p>
              </div>
            )}
          </div>
        )}

        {videoInputType === 'link' && (
          <div>
            <input
              type="url"
              id="videoLink"
              name="videoLink"
              value={videoLink}
              onChange={handleLinkChange}
              placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${
                errors.video ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {videoLink && isValidUrl(videoLink) && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Valid URL provided
                </p>
              </div>
            )}
          </div>
        )}

        {errors.video && <p className="text-sm text-red-500 mt-2 font-medium">{errors.video}</p>}

        <p className="text-xs text-gray-500 mt-2">
          {videoInputType === 'upload'
            ? 'Upload a video file from your computer (MP4, MOV, AVI, etc.)'
            : 'Provide a direct link to a video (supports YouTube, Vimeo, Cloudinary, etc.)'}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
          disabled={isLoading}
        >
          Cancel
        </button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Lesson' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  );
};

export default LessonForm;