import { useEffect, useRef, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus,
  Link, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Code,
} from 'lucide-react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

type ToolbarButton = {
  icon: React.ReactNode;
  title: string;
  action: () => void;
  isActive?: () => boolean;
};

export default function RichTextEditor({ value, onChange, placeholder = 'İçerik yazın...', minHeight = 400 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChange.current) { isInternalChange.current = false; return; }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = useCallback((command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  }, []);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const isActive = (command: string) => {
    try { return document.queryCommandState(command); } catch { return false; }
  };

  const insertLink = () => {
    const url = prompt('Link URL girin:', 'https://');
    if (url) exec('createLink', url);
  };

  const toolbarGroups: ToolbarButton[][] = [
    [
      { icon: <Undo className="w-4 h-4" />, title: 'Geri Al', action: () => exec('undo') },
      { icon: <Redo className="w-4 h-4" />, title: 'İleri Al', action: () => exec('redo') },
    ],
    [
      { icon: <Heading1 className="w-4 h-4" />, title: 'Başlık 1', action: () => exec('formatBlock', 'h1'), isActive: () => false },
      { icon: <Heading2 className="w-4 h-4" />, title: 'Başlık 2', action: () => exec('formatBlock', 'h2'), isActive: () => false },
      { icon: <Heading3 className="w-4 h-4" />, title: 'Başlık 3', action: () => exec('formatBlock', 'h3'), isActive: () => false },
    ],
    [
      { icon: <Bold className="w-4 h-4" />, title: 'Kalın', action: () => exec('bold'), isActive: () => isActive('bold') },
      { icon: <Italic className="w-4 h-4" />, title: 'İtalik', action: () => exec('italic'), isActive: () => isActive('italic') },
      { icon: <Underline className="w-4 h-4" />, title: 'Altı Çizili', action: () => exec('underline'), isActive: () => isActive('underline') },
      { icon: <Strikethrough className="w-4 h-4" />, title: 'Üstü Çizili', action: () => exec('strikeThrough'), isActive: () => isActive('strikeThrough') },
      { icon: <Code className="w-4 h-4" />, title: 'Kod', action: () => exec('formatBlock', 'pre'), isActive: () => false },
    ],
    [
      { icon: <AlignLeft className="w-4 h-4" />, title: 'Sola Hizala', action: () => exec('justifyLeft'), isActive: () => isActive('justifyLeft') },
      { icon: <AlignCenter className="w-4 h-4" />, title: 'Ortala', action: () => exec('justifyCenter'), isActive: () => isActive('justifyCenter') },
      { icon: <AlignRight className="w-4 h-4" />, title: 'Sağa Hizala', action: () => exec('justifyRight'), isActive: () => isActive('justifyRight') },
    ],
    [
      { icon: <List className="w-4 h-4" />, title: 'Madde İşareti', action: () => exec('insertUnorderedList'), isActive: () => isActive('insertUnorderedList') },
      { icon: <ListOrdered className="w-4 h-4" />, title: 'Numaralı Liste', action: () => exec('insertOrderedList'), isActive: () => isActive('insertOrderedList') },
      { icon: <Quote className="w-4 h-4" />, title: 'Alıntı', action: () => exec('formatBlock', 'blockquote'), isActive: () => false },
      { icon: <Minus className="w-4 h-4" />, title: 'Yatay Çizgi', action: () => exec('insertHorizontalRule'), isActive: () => false },
    ],
    [
      { icon: <Link className="w-4 h-4" />, title: 'Link Ekle', action: insertLink, isActive: () => false },
    ],
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-navy-400 transition-colors">
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-wrap gap-1">
        {toolbarGroups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <div className="w-px h-5 bg-gray-200 mx-1" />}
            {group.map((btn, bi) => (
              <button
                key={bi}
                type="button"
                title={btn.title}
                onMouseDown={e => { e.preventDefault(); btn.action(); }}
                className={`p-1.5 rounded-md transition-colors text-sm font-medium ${
                  btn.isActive?.()
                    ? 'bg-navy-800 text-white'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="p-4 focus:outline-none text-gray-800 text-sm leading-relaxed rich-editor-content"
      />
    </div>
  );
}
