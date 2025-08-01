// components/admin/LexicalToolbar.tsx
'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  RangeSelection, // <-- IMPORT TYPE
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $isHeadingNode, $createHeadingNode } from '@lexical/rich-text';
import { $isAtNodeEnd } from '@lexical/selection';
import { $setBlocksType } from '@lexical/selection';
import {
  Bold, Italic, Underline, Code, Link, Pilcrow, List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo, AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LowPriority = 1;

function Divider() {
  return <div className="w-px h-6 bg-gray-300 mx-1" />;
}

// ✅ FIX: Changed 'any' to 'RangeSelection' for proper typing.
function getSelectedNode(selection: RangeSelection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
      return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
      return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
}


export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // ✅ FIX: Removed 'editor' from dependency array.
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
            setIsLink(true);
            setLinkUrl(parent.getURL());
        } else if ($isLinkNode(node)) {
            setIsLink(true);
            setLinkUrl(node.getURL());
        } else {
            setIsLink(false);
            setLinkUrl('');
        }

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsCode(selection.hasFormat('code'));
        if ($isListNode(element)) {
            const parentList = $getNearestNodeOfType(anchorNode, ListNode);
            const type = parentList ? parentList.getTag() : element.getTag();
            setBlockType(type);
        } else {
            const type = $isHeadingNode(element) ? element.getTag() : element.getType();
            setBlockType(type);
        }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
            updateToolbar();
            });
        }),
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            updateToolbar();
            return false;
        }, LowPriority),
        editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
            setCanUndo(payload);
            return false;
        }, LowPriority),
        editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
            setCanRedo(payload);
            return false;
        }, LowPriority),
    );
  }, [editor, updateToolbar]);
  
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (type: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(type));
      }
    });
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const handleLinkSave = () => {
    if (linkUrl.trim() !== '') {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    } else {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
    setIsLinkDialogOpen(false);
  };


  return (
    <>
      <div className="flex items-center flex-wrap gap-1 p-1 bg-white border-b border-gray-300 rounded-t-lg">
        <button type="button" disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50" aria-label="Undo">
          <Undo className="w-4 h-4" />
        </button>
        <button type="button" disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50" aria-label="Redo">
          <Redo className="w-4 h-4" />
        </button>
        <Divider />
        <button type="button" onClick={formatParagraph} className={cn('p-2 rounded hover:bg-gray-100', blockType === 'paragraph' && 'bg-gray-200')}>
          <Pilcrow className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => formatHeading('h1')} className={cn('p-2 rounded hover:bg-gray-100', blockType === 'h1' && 'bg-gray-200')}>
          <Heading1 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => formatHeading('h2')} className={cn('p-2 rounded hover:bg-gray-100', blockType === 'h2' && 'bg-gray-200')}>
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => formatHeading('h3')} className={cn('p-2 rounded hover:bg-gray-100', blockType === 'h3' && 'bg-gray-200')}>
          <Heading3 className="w-4 h-4" />
        </button>
        <Divider />
        <button type="button" onClick={formatBulletList} className={cn('p-2 rounded hover:bg-gray-100', blockType === 'ul' && 'bg-gray-200')}>
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={formatNumberedList} className={cn('p-2 rounded hover:bg-gray-100', blockType === 'ol' && 'bg-gray-200')}>
          <ListOrdered className="w-4 h-4" />
        </button>
        <Divider />
        <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className={cn('p-2 rounded hover:bg-gray-100', isBold && 'bg-gray-200')} aria-label="Format Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className={cn('p-2 rounded hover:bg-gray-100', isItalic && 'bg-gray-200')} aria-label="Format Italics">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} className={cn('p-2 rounded hover:bg-gray-100', isUnderline && 'bg-gray-200')} aria-label="Format Underline">
          <Underline className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')} className={cn('p-2 rounded hover:bg-gray-100', isCode && 'bg-gray-200')} aria-label="Insert Code Block">
          <Code className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => setIsLinkDialogOpen(true)} className={cn('p-2 rounded hover:bg-gray-100', isLink && 'bg-gray-200')} aria-label="Insert Link">
            <Link className="w-4 h-4" />
        </button>
        <Divider />
        <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} className="p-2 rounded hover:bg-gray-100">
          <AlignLeft className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} className="p-2 rounded hover:bg-gray-100">
          <AlignCenter className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} className="p-2 rounded hover:bg-gray-100">
          <AlignRight className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} className="p-2 rounded hover:bg-gray-100">
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isLink ? 'Edit' : 'Masukkan'} Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://rise-bar-pkm.vercel.app"
                />
            </div>
            <DialogFooter>
                {isLink && (
                    <Button variant="destructive" onClick={() => { handleLinkSave(); }}>
                        Hapus Link
                    </Button>
                )}
                <Button onClick={handleLinkSave}>Simpan</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}