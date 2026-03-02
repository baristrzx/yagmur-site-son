import { useEffect, useRef, useCallback, useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus,
  Link, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Code, ChevronDown,
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

const FONT_FAMILIES = [
  { label: 'Varsayılan', value: '' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Palatino', value: '"Palatino Linotype", Palatino, serif' },
  { label: 'Garamond', value: 'Garamond, serif' },
  { label: 'Book Antiqua', value: '"Book Antiqua", Palatino, serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Impact', value: 'Impact, Charcoal, sans-serif' },
];

const FONT_SIZES = [
  { label: 'Küçük', value: '1' },
  { label: 'Normal', value: '3' },
  { label: 'Büyük', value: '4' },
  { label: 'Daha Büyük', value: '5' },
  { label: 'En Büyük', value: '6' },
];

export default function RichTextEditor({ value, onChange, placeholder = 'İçerik yazın...', minHeight = 400 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [currentFont, setCurrentFont] = useState('');
  const [currentSize, setCurrentSize] = useState('3');

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

  const applyFont = (fontValue: string) => {
    setCurrentFont(fontValue);
    setFontOpen(false);
    editorRef.current?.focus();
    if (fontValue) {
      document.execCommand('fontName', false, fontValue);
    } else {
      document.execCommand('fontName', false, 'Arial');
    }
    handleInput();
  };

  const applySize = (sizeValue: string) => {
    setCurrentSize(sizeValue);
    setSizeOpen(false);
    editorRef.current?.focus();
    document.execCommand('fontSize', false, sizeValue);
    handleInput();
  };

  const currentFontLabel = FONT_FAMILIES.find(f => f.value === currentFont)?.label || 'Yazı Tipi';
  const currentSizeLabel = FONT_SIZES.find(s => s.value === currentSize)?.label || 'Boyut';

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
    <div className="border border-gray-200 rounded-xl overflow-visible focus-within:border-navy-400 transition-colors">
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-wrap gap-1 items-center">

        {/* Font Family Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); setFontOpen(o => !o); setSizeOpen(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200 bg-white min-w-[110px] justify-between"
          >
            <span style={{ fontFamily: currentFont || undefined }} className="truncate max-w-[80px]">{currentFontLabel}</span>
            <ChevronDown className="w-3 h-3 shrink-0 text-gray-400" />
          </button>
          {fontOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 min-w-[180px]">
              {FONT_FAMILIES.map(f => (
                <button
                  key={f.value}
                  type="button"
                  onMouseDown={e => { e.preventDefault(); applyFont(f.value); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${currentFont === f.value ? 'text-navy-800 font-semibold bg-navy-50' : 'text-gray-700'}`}
                  style={{ fontFamily: f.value || undefined }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); setSizeOpen(o => !o); setFontOpen(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200 bg-white min-w-[90px] justify-between"
          >
            <span className="truncate">{currentSizeLabel}</span>
            <ChevronDown className="w-3 h-3 shrink-0 text-gray-400" />
          </button>
          {sizeOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 min-w-[130px]">
              {FONT_SIZES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onMouseDown={e => { e.preventDefault(); applySize(s.value); }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${currentSize === s.value ? 'text-navy-800 font-semibold bg-navy-50' : 'text-gray-700'}`}
                  style={{ fontSize: s.value === '1' ? '11px' : s.value === '3' ? '14px' : s.value === '4' ? '17px' : s.value === '5' ? '20px' : '24px' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {toolbarGroups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <div className="w-px h-5 bg-gray-200 mx-1" />}
            {group.map((btn, bi) => (
              <button
                key={bi}
                type="button"
                title={btn.title}
                onMouseDown={e => { e.preventDefault(); setFontOpen(false); setSizeOpen(false); btn.action(); }}
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
        onClick={() => { setFontOpen(false); setSizeOpen(false); }}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="p-4 focus:outline-none text-gray-800 text-sm leading-relaxed rich-editor-content"
      />
    </div>
  );
}
