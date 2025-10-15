 // src/components/RichTextEditor.tsx

import React, { useState, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Type, Code, FileText } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string, type: 'text' | 'markdown' | 'html') => void;
  initialType?: 'text' | 'markdown' | 'html';
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  initialType = 'text',
  label = 'Description',
  placeholder = 'Enter description...',
  required = false,
  error,
}) => {
  const [editorType, setEditorType] = useState<'text' | 'markdown' | 'html'>(initialType);
  const [localValue, setLocalValue] = useState(value);

  const handleTypeChange = (type: 'text' | 'markdown' | 'html') => {
    setEditorType(type);
    onChange(localValue, type);
  };

  const handleValueChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue, editorType);
  };

  // SimpleMDE options
  const mdeOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: placeholder,
      status: false,
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
      ] as any,
    };
  }, [placeholder]);

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-3 border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleTypeChange('text')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-2 ${
            editorType === 'text'
              ? 'border-blue-600 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Type className="h-4 w-4" />
          Plain Text
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('markdown')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-2 ${
            editorType === 'markdown'
              ? 'border-blue-600 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <FileText className="h-4 w-4" />
          Markdown
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('html')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-2 ${
            editorType === 'html'
              ? 'border-blue-600 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Code className="h-4 w-4" />
          HTML
        </button>
      </div>

      {/* Editor Area */}
      <div className="border rounded-lg overflow-hidden">
        {editorType === 'text' && (
          <textarea
            value={localValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={8}
            className={`block w-full px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}

        {editorType === 'markdown' && (
          <div className="markdown-editor">
            <SimpleMDE
              value={localValue}
              onChange={handleValueChange}
              options={mdeOptions}
            />
          </div>
        )}

        {editorType === 'html' && (
          <div className="relative">
            <textarea
              value={localValue}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="<div>Your HTML content here...</div>"
              required={required}
              rows={8}
              className={`block w-full px-4 py-3 font-mono text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              HTML
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500 mt-1 font-medium">{error}</p>}

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-2">
        {editorType === 'text' && 'Plain text description without formatting'}
        {editorType === 'markdown' && 'Use Markdown syntax for formatting (preview available)'}
        {editorType === 'html' && 'Write raw HTML for advanced formatting'}
      </p>
    </div>
  );
};

export default RichTextEditor;