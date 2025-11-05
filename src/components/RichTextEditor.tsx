'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Importar TinyMCE apenas no cliente para evitar problemas de SSR
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { ssr: false }
);

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
  const editorRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEditorChange = (content: string) => {
    onChange?.(content);
  };

  if (!isMounted) {
    return (
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-slate-800">
            Editor de Texto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            Carregando editor...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-slate-800">
          Editor de Texto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Editor
          apiKey="y5ot8fgnxqyf1qouus0qq72gi6112z6zbuyte3t1i02u6pp6"
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: 400,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | image link | code fullscreen',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
            placeholder: placeholder,
            // Configurações avançadas de imagem
            image_advtab: true,
            image_caption: true,
            image_list: [],
            image_resize: true,
            image_dimensions: true,
            image_description: true,
            image_title: true,
            // Permitir upload automático de imagens
            automatic_uploads: true,
            file_picker_types: 'image',
            paste_data_images: true,
            // Handler para upload de imagens (converte para base64)
            images_upload_handler: async (blobInfo) => {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = reader.result as string;
                  resolve(base64);
                };
                reader.onerror = () => {
                  resolve('');
                };
                reader.readAsDataURL(blobInfo.blob());
              });
            },
            // Configurações de resize de imagem
            image_class_list: [
              {title: 'Nenhuma', value: ''},
              {title: 'Pequena', value: 'img-small'},
              {title: 'Média', value: 'img-medium'},
              {title: 'Grande', value: 'img-large'}
            ],
            // Permitir resize arrastando as bordas da imagem
            object_resizing: true,
            // Configurações de link
            link_title: false,
            link_target_list: [
              {title: 'Nenhum', value: ''},
              {title: 'Nova janela', value: '_blank'}
            ],
            // Melhorias de UX
            branding: false,
            elementpath: true,
            statusbar: true,
            // Suporte a colar imagens diretamente
            paste_as_text: false,
            paste_auto_cleanup_on_paste: true,
            // Configurações de idioma (português)
            language: 'pt_BR',
            language_url: undefined, // Usar idioma padrão
          }}
        />
      </CardContent>
    </Card>
  );
}
