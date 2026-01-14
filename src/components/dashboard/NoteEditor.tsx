import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Note, CreateNoteInput } from '@/hooks/useNotes';

interface NoteEditorProps {
  note?: Note | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateNoteInput) => Promise<void>;
}

const colorOptions = [
  { value: '#ffffff', label: 'White', class: 'bg-white' },
  { value: '#ddd4c7', label: 'Cream', class: 'bg-note-cream' },
  { value: '#c8dcd2', label: 'Sage', class: 'bg-note-sage' },
  { value: '#dcd4e3', label: 'Lavender', class: 'bg-note-lavender' },
  { value: '#ddc8ba', label: 'Peach', class: 'bg-note-peach' },
  { value: '#c4dde8', label: 'Sky', class: 'bg-note-sky' },
  { value: '#c9e0d5', label: 'Mint', class: 'bg-note-mint' },
];

export function NoteEditor({ note, open, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setBgColor(note.bg_color);
      setTags(note.tags?.join(', ') || '');
    } else {
      setTitle('');
      setContent('');
      setBgColor('#ffffff');
      setTags('');
    }
  }, [note, open]);

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      await onSave({
        title: title.trim(),
        content: content.trim() || undefined,
        bg_color: bgColor,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{note ? 'Edit Note' : 'Create Note'}</DialogTitle>
          <DialogDescription className="sr-only">
            {note ? 'Edit your note details below' : 'Create a new note by filling out the form below'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              rows={6}
              className="text-sm sm:text-base resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (comma separated)
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, personal, ideas..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Background Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setBgColor(color.value)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                    color.class
                  } ${
                    bgColor === color.value
                      ? 'border-primary scale-110'
                      : 'border-border hover:scale-105'
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !title.trim()} className="w-full sm:w-auto">
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
