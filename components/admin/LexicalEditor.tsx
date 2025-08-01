// components/admin/LexicalEditor.tsx
'use client';

import { $getRoot, $getSelection, EditorState } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import LexicalToolbar from './LexicalToolbar';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useEffect, useState } from 'react';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';


const theme = {
  paragraph: 'mb-4 text-base',
  quote: 'pl-4 border-l-4 border-gray-300 italic my-4',
  heading: {
    h1: 'text-3xl font-bold my-6',
    h2: 'text-2xl font-bold my-5',
    h3: 'text-xl font-bold my-4',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal pl-6 my-4',
    ul: 'list-disc pl-6 my-4',
    listitem: 'mb-2',
  },
  link: 'text-cyan-600 hover:underline',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    code: 'bg-gray-100 text-gray-800 p-1 rounded text-sm font-mono',
  },
  code: 'bg-gray-100 p-4 rounded-md block text-sm font-mono my-4 overflow-x-auto',
};


function EditorPlaceholder() {
  return <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">Tulis konten di sini...</div>;
}

const editorConfig = {
  namespace: 'RiseBarEditor',
  theme,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
  ],
};

// Plugin ini sekarang bertugas untuk mengisi state internal dan menginisialisasi editor dari HTML
function HtmlPlugin({ setHtml, initialValue }: { setHtml: (html: string) => void, initialValue?: string }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender && initialValue) {
      setIsFirstRender(false);
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialValue, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.select();
        const selection = $getSelection();
        selection?.insertNodes(nodes);
      });
    }
  }, [editor, initialValue, isFirstRender]);

  const handleOnChange = (editorState: EditorState) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      setHtml(htmlString);
    });
  };

  return <OnChangePlugin onChange={handleOnChange} />;
}


// ✅ PERBAIKAN UTAMA:
// Komponen sekarang menerima `name` dan `initialValue` agar bisa langsung digunakan di dalam <form>
export default function LexicalEditor({ name, initialValue }: { name: string, initialValue?: string }) {
  const [htmlContent, setHtmlContent] = useState(initialValue || '');
  
  const initialConfig = { ...editorConfig, editorState: null };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative border border-gray-300 rounded-lg">
        <LexicalToolbar />
        <div className="relative bg-white rounded-b-lg">
          {/* Textarea tersembunyi untuk menyimpan konten HTML dan mengirimkannya saat form di-submit */}
          <textarea
            name={name}
            value={htmlContent}
            readOnly
            className="hidden"
          />

          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-48 resize-y p-4 outline-none" />}
            placeholder={<EditorPlaceholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          
          {/* Plugin internal untuk sinkronisasi state Lexical ke state React (dan textarea) */}
          <HtmlPlugin initialValue={initialValue} setHtml={setHtmlContent} />
        </div>
      </div>
    </LexicalComposer>
  );
}