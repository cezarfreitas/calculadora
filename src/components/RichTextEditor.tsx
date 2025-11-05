'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ 
  content = '', 
  onChange,
  placeholder = 'Digite seu texto aqui... Você pode formatar, adicionar imagens e links.'
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        let imageFound = false;
        
        for (const item of items) {
          if (item.type.indexOf('image') !== -1) {
            imageFound = true;
            event.preventDefault();
            event.stopPropagation();
            const blob = item.getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = e.target?.result as string;
                if (base64) {
                  // Usar setTimeout para garantir que o editor está pronto
                  setTimeout(() => {
                    const { state, dispatch } = view;
                    const { tr } = state;
                    const imageNode = state.schema.nodes.image.create({
                      src: base64,
                    });
                    tr.replaceSelectionWith(imageNode);
                    dispatch(tr);
                  }, 0);
                }
              };
              reader.readAsDataURL(blob);
            }
            break; // Processar apenas a primeira imagem encontrada
          }
        }
        return imageFound; // Retorna true se uma imagem foi processada, false caso contrário
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    // Criar input de arquivo para upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          if (base64) {
            editor.chain().focus().setImage({ src: base64 }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addImageUrl = () => {
    const url = window.prompt('Cole a URL da imagem:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };


  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-slate-800">
          Editor de Texto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-gray-200' : ''}
              aria-label="Negrito"
            >
              <Bold className="w-4 h-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-gray-200' : ''}
              aria-label="Itálico"
            >
              <Italic className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
              aria-label="Título 1"
            >
              H1
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
              aria-label="Título 2"
            >
              H2
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
              aria-label="Lista com marcadores"
            >
              <List className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
              aria-label="Lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addLink}
              className={editor.isActive('link') ? 'bg-gray-200' : ''}
              aria-label="Adicionar link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addImage}
              aria-label="Adicionar imagem (upload)"
              title="Adicionar imagem (upload de arquivo)"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addImageUrl}
              aria-label="Adicionar imagem por URL"
              title="Adicionar imagem por URL"
              className="text-xs"
            >
              URL
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              aria-label="Desfazer"
            >
              <Undo className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              aria-label="Refazer"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {/* Editor */}
          <div className="min-h-[200px] max-h-[500px] overflow-y-auto bg-white">
            <EditorContent editor={editor} />
          </div>
        </div>
        
        {/* Preview do HTML (opcional, para debug) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer">HTML gerado</summary>
            <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto max-h-32">
              {editor.getHTML()}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

