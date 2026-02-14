import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Palette, Image as ImageIcon, X } from 'lucide-react';
import { useNotes, CreateNoteInput, Note } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const colorOptions = [
  { value: '#F8F9FA', label: 'Default', bg: 'bg-[#F8F9FA]' },
  { value: '#faf5f0', label: 'Cream', bg: 'bg-[#faf5f0]' },
  { value: '#e8f0e8', label: 'Sage', bg: 'bg-[#e8f0e8]' },
  { value: '#f0e8f5', label: 'Lavender', bg: 'bg-[#f0e8f5]' },
  { value: '#fae8e0', label: 'Peach', bg: 'bg-[#fae8e0]' },
  { value: '#e0f0fa', label: 'Sky', bg: 'bg-[#e0f0fa]' },
  { value: '#e0faf0', label: 'Mint', bg: 'bg-[#e0faf0]' },
];

const bgImages = [
  '/avatars/photo1.png',
  '/avatars/photo2.png',
  '/avatars/photo3.png',
  '/avatars/photo4.png',
  '/avatars/photo5.jpg',
  '/avatars/photo6.webp',
  '/avatars/photo7.jpeg',
  '/avatars/photo8.jpg',
];

export default function NewNote() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { createNote, updateNote, notes } = useNotes();
  const existingNote = isEdit ? notes.find((n) => n.id === id) : undefined;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('#F8F9FA');
  const [bgImageUrl, setBgImageUrl] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea function
  const autoResize = (element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoResize(titleRef.current);
    autoResize(contentRef.current);
  }, [title, content]);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title || '');
      setContent(existingNote.content || '');
      setBgColor(existingNote.bg_color || '#F8F9FA');
      setBgImageUrl(existingNote.bg_image_url || undefined);
      setTags(existingNote.tags?.join(', ') || '');
    }
  }, [existingNote]);

  const handleSave = async () => {
    if (!title.trim()) return;

    const data: CreateNoteInput = {
      title: title.trim(),
      content: content.trim(),
      bg_color: bgColor,
      bg_image_url: bgImageUrl,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isEdit && existingNote) {
      await updateNote.mutateAsync({ id: existingNote.id, ...data });
    } else {
      await createNote.mutateAsync(data);
    }
    navigate('/dashboard');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (title.trim()) {
          handleSave();
        }
      }
      // Escape to go back
      if (e.key === 'Escape') {
        navigate('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content, bgColor, bgImageUrl, tags, isEdit, existingNote]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card/50 backdrop-blur-sm z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="h-10 w-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-base">{isEdit ? 'Edit Note' : 'Create Note'}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          disabled={!title.trim()}
          className="h-10 w-10 text-primary"
        >
          <Check className="w-5 h-5" />
        </Button>
      </motion.header>

      {/* Main Content */}
      <motion.div
        className="flex-1 overflow-y-auto pb-32"
        style={{
          backgroundColor: bgImageUrl ? '#FFFFFF' : bgColor,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Background Image Layer */}
        {bgImageUrl && (
          <>
            <div
              className="fixed inset-0 z-0"
              style={{
                backgroundImage: `url(${bgImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            {/* Light overlay for text readability */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-white/40 via-white/45 to-white/55" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 px-5 py-6">
          {/* Title Input */}
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full bg-transparent border-none outline-none resize-none text-3xl font-bold text-foreground placeholder:text-muted-foreground/40 mb-4 overflow-hidden"
            rows={1}
            style={{
              minHeight: '44px',
              lineHeight: '1.3',
            }}
            autoFocus
          />

          {/* Content Input */}
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="w-full bg-transparent border-none outline-none resize-none text-base text-foreground/90 placeholder:text-muted-foreground/40 leading-relaxed overflow-hidden"
            rows={10}
            style={{
              minHeight: 'calc(100vh - 300px)',
            }}
          />
        </div>
      </motion.div>

      {/* Bottom Action Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/30 shadow-2xl z-30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowImagePicker(false);
            }}
            className={cn(
              "h-11 w-11 rounded-full",
              showColorPicker && "bg-primary/20 text-primary"
            )}
          >
            <Palette className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowImagePicker(!showImagePicker);
              setShowColorPicker(false);
            }}
            className={cn(
              "h-11 w-11 rounded-full",
              showImagePicker && "bg-primary/20 text-primary"
            )}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Color Picker Panel */}
        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              className="px-4 pb-4 pt-2 border-t border-border/20"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-3">Background:</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      setBgColor(color.value);
                      setBgImageUrl(undefined);
                    }}
                    className={cn(
                      'relative shrink-0 w-12 h-12 rounded-full border-2 transition-all',
                      color.bg,
                      bgColor === color.value && !bgImageUrl
                        ? 'border-primary ring-2 ring-primary/30 scale-110'
                        : 'border-border/50'
                    )}
                    title={color.label}
                  >
                    {bgColor === color.value && !bgImageUrl && (
                      <Check className="absolute inset-0 m-auto w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Picker Panel */}
        <AnimatePresence>
          {showImagePicker && (
            <motion.div
              className="px-4 pb-4 pt-2 border-t border-border/20"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-3">Background image:</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {bgImages.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setBgImageUrl(src)}
                    className={cn(
                      'relative shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all',
                      bgImageUrl === src
                        ? 'border-primary ring-2 ring-primary/30 scale-105'
                        : 'border-border/50'
                    )}
                  >
                    <img src={src} alt="Background" className="w-full h-full object-cover" />
                    {bgImageUrl === src && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                ))}
                {bgImageUrl && (
                  <button
                    type="button"
                    onClick={() => setBgImageUrl(undefined)}
                    className="shrink-0 w-20 h-20 rounded-xl border-2 border-border/50 flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
