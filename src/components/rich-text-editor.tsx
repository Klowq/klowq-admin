'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect } from 'react';
import {
  HiOutlineBold,
  HiOutlineItalic,
  HiOutlineListBullet,
  HiOutlineNumberedList,
  HiArrowUturnLeft,
  HiArrowUturnRight,
} from 'react-icons/hi2';

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/50 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('bold') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Bold"
        aria-label="Bold"
      >
        <HiOutlineBold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('italic') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Italic"
        aria-label="Italic"
      >
        <HiOutlineItalic className="w-4 h-4" />
      </button>
      <span className="w-px h-5 bg-border mx-0.5" aria-hidden />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('bulletList') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Bullet list"
        aria-label="Bullet list"
      >
        <HiOutlineListBullet className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('orderedList') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        title="Numbered list"
        aria-label="Numbered list"
      >
        <HiOutlineNumberedList className="w-4 h-4" />
      </button>
      <span className="w-px h-5 bg-border mx-0.5" aria-hidden />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-muted disabled:opacity-40 text-muted-foreground"
        title="Undo"
        aria-label="Undo"
      >
        <HiArrowUturnLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-muted disabled:opacity-40 text-muted-foreground"
        title="Redo"
        aria-label="Redo"
      >
        <HiArrowUturnRight className="w-4 h-4" />
      </button>
    </div>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-foreground',
      },
    },
  });

  const handleUpdate = useCallback(() => {
    if (editor) onChange(editor.getHTML());
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) return;
    editor.on('update', handleUpdate);
    const onBlur = () => onChange(editor.getHTML());
    editor.on('blur', onBlur);
    return () => {
      editor.off('update', handleUpdate);
      editor.off('blur', onBlur);
    };
  }, [editor, handleUpdate, onChange]);

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className={`border border-border rounded-lg bg-card overflow-hidden min-h-[280px] ${className}`}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
