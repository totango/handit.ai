/**
 * Text Editor Component
 * 
 * A rich text editor component built on top of TipTap, providing a modern
 * and extensible editing experience. Supports basic text formatting, links,
 * and placeholders with a customizable toolbar.
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import { TextEditorToolbar } from './text-editor-toolbar';

/**
 * Text Editor Component
 * 
 * A thin wrapper around TipTap that provides a rich text editing experience.
 * Supports basic text formatting, links, and placeholders with an optional toolbar.
 * 
 * @example
 * ```tsx
 * <TextEditor
 *   onUpdate={({ editor }) => {
 *     console.log(editor.getHTML());
 *   }}
 * />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {string} [props.content] - Initial HTML content for the editor
 * @param {boolean} [props.editable=true] - Whether the editor is editable
 * @param {boolean} [props.hideToolbar] - Whether to hide the formatting toolbar
 * @param {Function} [props.onUpdate=()=>{}] - Callback when content is updated
 * @param {string} [props.placeholder] - Placeholder text when editor is empty
 * @returns {JSX.Element} A rich text editor with optional toolbar
 */
export function TextEditor({
  content,
  editable = true,
  hideToolbar,
  onUpdate = () => {
    // noop
  },
  placeholder,
}) {
  // Configure editor extensions
  const extensions = [
    StarterKit,
    Placeholder.configure({ emptyEditorClass: 'is-editor-empty', placeholder }),
    Link.configure({ openOnClick: false, autolink: true }),
  ];

  // Initialize the editor with configured extensions
  const editor = useEditor({ extensions, content, editable, onUpdate });

  return (
    <Box
      className="tiptap-root"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // Apply border and shadow only when editor is editable
        ...(editable && {
          border: '1px solid var(--mui-palette-divider)',
          borderRadius: 1,
          boxShadow: 'var(--mui-shadows-1)',
        }),
        // Container styles for proper layout
        '& .tiptap-container': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: 0
        },
        // Editor content styles
        '& .tiptap': {
          color: 'var(--mui-palette-text-primary)',
          flex: '1 1 auto',
          overflow: 'auto',
          p: '8px 16px',
          '&:focus-visible': { outline: 'none' },
          // Table resize cursor styles
          '&.resize-cursor': {
            cursor: 'ew-resize',
            '& table': { cursor: 'col-resize' }
          },
          // Placeholder styles
          '& .is-editor-empty:before': {
            color: 'var(--mui-palette-text-secondary)',
            content: 'attr(data-placeholder)',
            float: 'left',
            height: 0,
            pointerEvents: 'none',
          },
        },
      }}
    >
      {/* Conditional toolbar rendering */}
      {!hideToolbar ? <TextEditorToolbar editor={editor} /> : <div />}
      {/* Editor content area */}
      <EditorContent className="tiptap-container" editor={editor} />
    </Box>
  );
}
