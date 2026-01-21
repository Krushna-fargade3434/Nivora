import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNotes, CreateNoteInput, Note } from '@/hooks/useNotes';

export default function NewNote() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { createNote, updateNote, notes } = useNotes();
  const existingNote = isEdit ? notes.find((n) => n.id === id) : undefined;

  const handleSave = async (data: CreateNoteInput) => {
    if (isEdit && existingNote) {
      await updateNote.mutateAsync({ id: existingNote.id, ...data });
    } else {
      await createNote.mutateAsync(data);
    }
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-6 md:mb-8"
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
         >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
             {isEdit ? 'Edit Note' : 'Create Note'}
           </h1>
           <p className="text-muted-foreground">
             {isEdit ? 'Update your note details' : 'Add a new note to your collection'}
           </p>
         </motion.div>

         {/* Full page editor */}
         <motion.div
          className="bg-card rounded-2xl border border-border/50 shadow-soft p-4 md:p-6"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
         >
           <NoteEditorInline onSave={handleSave} note={existingNote} isEdit={isEdit} />
         </motion.div>
       </div>
     </DashboardLayout>
   );
}

// Inline editor component updated with bg image and bold title
import { useState, useEffect, useRef } from 'react';
import { Save, Palette, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const colorOptions = [
  { value: '#ffffff', label: 'White', class: 'bg-white' },
  { value: '#faf5f0', label: 'Cream', class: 'bg-note-cream' },
  { value: '#e8f0e8', label: 'Sage', class: 'bg-note-sage' },
  { value: '#f0e8f5', label: 'Lavender', class: 'bg-note-lavender' },
  { value: '#fae8e0', label: 'Peach', class: 'bg-note-peach' },
  { value: '#e0f0fa', label: 'Sky', class: 'bg-note-sky' },
  { value: '#e0faf0', label: 'Mint', class: 'bg-note-mint' },
];

const sampleImages = [
  '/avatars/photo1.png',
  '/avatars/photo2.png',
  '/avatars/photo3.png',
  '/avatars/photo4.png',
  '/avatars/photo5.jpg',
  '/avatars/photo6.webp',
  '/avatars/photo7.jpeg',
  '/avatars/photo8.jpg',
  '/avatars/photo9.jpeg',
  '/avatars/photo10.jpeg',
  '/avatars/photo11.jpg',
  '/avatars/photo12.jpg',
  '/avatars/photo13.jpg',
  '/avatars/photo14.jpg',
  '/avatars/photo15.jpeg',
  '/avatars/photo16.jpg',
  '/avatars/photo17.jpg',
  '/avatars/photo18.jpg',
  '/avatars/photo19.jpg',
  '/avatars/photo20.jpeg',
  '/avatars/photo21.jpg',
  '/avatars/photo22.jpg',
];

function NoteEditorInline({ onSave, note, isEdit }: { onSave: (data: CreateNoteInput) => void; note?: Note; isEdit: boolean }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImageUrl, setBgImageUrl] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState('');
  const [showColors, setShowColors] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const navigate = useNavigate();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setBgColor(note.bg_color || '#ffffff');
      setBgImageUrl(note.bg_image_url || undefined);
      setTags(note.tags?.join(', ') || '');
    } else {
      setTitle('');
      setContent('');
      setBgColor('#ffffff');
      setBgImageUrl(undefined);
      setTags('');
    }
  }, [note]);

  useEffect(() => {
    autoGrow();
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      bg_color: bgColor,
      bg_image_url: bgImageUrl,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Options: Color and Image */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-display font-semibold">Options</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowColors(!showColors)}
              className="gap-2"
            >
              <Palette className="w-4 h-4" />
              Bg Color
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowImages(!showImages)}
              className="gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Image
            </Button>
          </div>
        </div>

        {showColors && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <span className="text-sm text-muted-foreground">Background:</span>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setBgColor(color.value)}
                  className={cn(
                    'w-7 h-7 rounded-full border-2 transition-all',
                    color.class,
                    bgColor === color.value ? 'border-primary scale-110' : 'border-border hover:scale-105'
                  )}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        )}

        {showImages && (
          <div className="space-y-3 p-3 rounded-xl bg-muted/50">
            <span className="text-sm text-muted-foreground">Background image:</span>
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 -mx-2 px-2">
                {sampleImages.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setBgImageUrl(src)}
                    className={cn(
                      'relative w-20 h-20 shrink-0 rounded-lg border overflow-hidden hover:ring-2 hover:ring-primary snap-start',
                      bgImageUrl === src ? 'ring-2 ring-primary' : 'border-border'
                    )}
                    title={src}
                  >
                    <img src={src} alt="sample" className="w-full h-full object-cover" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBgImageUrl(undefined)}
                  className="w-20 h-20 shrink-0 rounded-lg border border-border text-xs text-muted-foreground flex items-center justify-center snap-start"
                  title="Remove image"
                >
                  Remove
                </button>
              </div>
            </div>
            {/* Custom image URL input removed as requested */}
          </div>
        )}
      </div>

      {/* Main content block with live bg image preview */}
      <div
        className="relative space-y-4 md:space-y-5 p-4 md:p-5 rounded-xl border border-border/50 overflow-hidden"
         style={{
           backgroundColor: bgColor,
           backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}
       >
        {/* Soft gradient overlay to keep inputs readable over the image */}
        {bgImageUrl && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.25) 100%)'
            }}
          />
        )}

        <div className="relative z-10 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="h-12 text-lg font-bold bg-white/60 border-border/50 focus:border-primary"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                // auto-grow immediately on input
                const el = textareaRef.current;
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
              placeholder="Write your note here..."
              className="min-h-[70dvh] overflow-hidden bg-white/60 border-border/50 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="personal, work, ideas..."
              className="bg-white/60 border-border/50 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
      <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
          Cancel
        </Button>
      <Button type="submit" disabled={!title.trim()} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Save Changes' : 'Create Note'}
        </Button>
      </div>
    </form>
  );
}
