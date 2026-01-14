import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { NoteEditor } from '@/components/dashboard/NoteEditor';
import { useNotes, CreateNoteInput } from '@/hooks/useNotes';

export default function NewNote() {
  const navigate = useNavigate();
  const { createNote } = useNotes();

  const handleSave = async (data: CreateNoteInput) => {
    await createNote.mutateAsync(data);
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Create Note
          </h1>
          <p className="text-muted-foreground">
            Add a new note to your collection
          </p>
        </motion.div>

        {/* Inline editor */}
        <motion.div
          className="bg-card rounded-2xl border border-border/50 shadow-soft p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NoteEditorInline onSave={handleSave} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

// Inline version of the note editor
import { useState } from 'react';
import { Save, Palette } from 'lucide-react';
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

function NoteEditorInline({ onSave }: { onSave: (data: CreateNoteInput) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [tags, setTags] = useState('');
  const [showColors, setShowColors] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      bg_color: bgColor,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Color picker toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-lg font-display font-semibold">New Note</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowColors(!showColors)}
          className="gap-2"
        >
          <Palette className="w-4 h-4" />
          Color
        </Button>
      </div>

      {/* Color picker */}
      {showColors && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <span className="text-sm text-muted-foreground">Background:</span>
          <div className="flex gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setBgColor(color.value)}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-all',
                  color.class,
                  bgColor === color.value
                    ? 'border-primary scale-110'
                    : 'border-border hover:scale-105'
                )}
                title={color.label}
              />
            ))}
          </div>
        </div>
      )}

      <div 
        className="space-y-5 p-5 rounded-xl border border-border/50"
        style={{ backgroundColor: bgColor }}
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="h-12 text-lg font-medium bg-white/50 border-border/50 focus:border-primary"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[200px] resize-none bg-white/50 border-border/50 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="personal, work, ideas..."
            className="bg-white/50 border-border/50 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          <Save className="w-4 h-4 mr-2" />
          Create Note
        </Button>
      </div>
    </form>
  );
}
