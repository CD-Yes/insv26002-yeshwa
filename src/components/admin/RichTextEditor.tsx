import { useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { COLORS } from '@/data/siteConfig';
import { uploadImage } from '@/lib/r2';
import { useAuth } from '@/app/providers/AuthProvider';

interface RichTextEditorProps {
  /** Initial HTML content. */
  initialHTML?: string;
  /** Fires on every change with both JSON and HTML for storage. */
  onChange: (payload: { html: string; json: unknown }) => void;
}

/**
 * TipTap rich-text editor for blog content. Supports headings, bold/italic,
 * lists, quote, links and inline images (uploaded to R2). Emits content_html +
 * content_json for storage.
 */
export function RichTextEditor({ initialHTML, onChange }: RichTextEditorProps) {
  const { accessToken } = useAuth();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Write your article…' }),
    ],
    content: initialHTML || '',
    onUpdate: ({ editor }) => onChange({ html: editor.getHTML(), json: editor.getJSON() }),
  });

  // Keep editor content in sync if the post loads after mount.
  useEffect(() => {
    if (editor && initialHTML && editor.isEmpty) {
      editor.commands.setContent(initialHTML);
    }
  }, [editor, initialHTML]);

  if (!editor) return null;

  return (
    <div style={{ border: '1px solid #D8CDB6', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <Toolbar editor={editor} accessToken={accessToken} />
      <div style={{ padding: '16px 18px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor, accessToken }: { editor: Editor; accessToken: string | null }) {
  const btn = (active: boolean): React.CSSProperties => ({
    cursor: 'pointer',
    border: 'none',
    background: active ? COLORS.accent : 'transparent',
    color: active ? '#fff' : COLORS.slate,
    fontWeight: 600,
    fontSize: 13.5,
    padding: '6px 10px',
    borderRadius: 7,
    minWidth: 32,
  });

  async function insertImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const res = await uploadImage(file, { purpose: 'blog', accessToken });
        editor.chain().focus().setImage({ src: res.public_url, alt: res.file_name }).run();
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Image upload failed');
      }
    };
    input.click();
  }

  function setLink() {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px 10px', borderBottom: '1px solid #EADFC9', background: '#FBF7EF' }}>
      <button type="button" style={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" style={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" style={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
      <button type="button" style={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
      <button type="button" style={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button type="button" style={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button type="button" style={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
      <button type="button" style={btn(editor.isActive('link'))} onClick={setLink}>Link</button>
      <button type="button" style={btn(false)} onClick={insertImage}>Image</button>
    </div>
  );
}
