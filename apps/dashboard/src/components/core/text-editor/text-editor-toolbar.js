/**
 * Text Editor Toolbar Component
 * 
 * A formatting toolbar for the rich text editor that provides controls for
 * text styling, headings, lists, and links. Includes a popover for link
 * management and various formatting buttons.
 */

'use client';

import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { Code as CodeIcon } from '@phosphor-icons/react/dist/ssr/Code';
import { Link as LinkIcon } from '@phosphor-icons/react/dist/ssr/Link';
import { LinkBreak as LinkBreakIcon } from '@phosphor-icons/react/dist/ssr/LinkBreak';
import { ListDashes as ListDashesIcon } from '@phosphor-icons/react/dist/ssr/ListDashes';
import { ListNumbers as ListNumbersIcon } from '@phosphor-icons/react/dist/ssr/ListNumbers';
import { TextB as TextBIcon } from '@phosphor-icons/react/dist/ssr/TextB';
import { TextItalic as TextItalicIcon } from '@phosphor-icons/react/dist/ssr/TextItalic';
import { TextStrikethrough as TextStrikethroughIcon } from '@phosphor-icons/react/dist/ssr/TextStrikethrough';

import { usePopover } from '@/hooks/use-popover';
import { Option } from '@/components/core/option';

/**
 * Text Editor Toolbar Component
 * 
 * Renders a toolbar with formatting controls for the text editor.
 * Includes text styling, headings, lists, and link management.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.editor - The TipTap editor instance
 * @returns {JSX.Element} A toolbar with formatting controls
 */
export function TextEditorToolbar({ editor }) {
  // State for link management
  const linkPopover = usePopover();
  const [link, setLink] = React.useState('');

  return (
    <React.Fragment>
      {/* Main Toolbar Container */}
      <Stack
        className="tiptap-toolbar"
        spacing={1}
        sx={{ borderBottom: '1px solid var(--mui-palette-divider)', p: '8px', minHeight: '57px' }}
      >
        {editor ? (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Heading/Paragraph Selector */}
            <Select
              onChange={(event) => {
                const value = event.target.value;

                if (!value) {
                  return;
                }

                if (value === 'p') {
                  editor.chain().focus().setParagraph().run();
                  return;
                }

                if (value.startsWith('h')) {
                  const level = parseInt(value.replace('h', ''));

                  if (!isNaN(level) && level >= 1 && level <= 6) {
                    editor.chain().focus().setHeading({ level }).run();
                  }
                }
              }}
              value={getFontValue(editor)}
            >
              <Option disabled={!editor.can().chain().focus().setParagraph().run()} value="p">
                Paragrah
              </Option>
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <Option
                  disabled={!editor.can().chain().focus().setHeading({ level }).run()}
                  key={level}
                  value={`h${level}`}
                >
                  Heading {level}
                </Option>
              ))}
            </Select>

            {/* Text Formatting Buttons */}
            <ToolbarButton
              active={editor.isActive('bold')}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              onClick={() => {
                editor.chain().focus().toggleBold().run();
              }}
            >
              <TextBIcon />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('italic')}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              onClick={() => {
                editor.chain().focus().toggleItalic().run();
              }}
            >
              <TextItalicIcon />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('strike')}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              onClick={() => {
                editor.chain().focus().toggleStrike().run();
              }}
            >
              <TextStrikethroughIcon />
            </ToolbarButton>

            {/* Code Block Button */}
            <ToolbarButton
              active={editor.isActive('codeBlock')}
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              onClick={() => {
                editor.chain().focus().toggleCodeBlock();
              }}
            >
              <CodeIcon />
            </ToolbarButton>

            {/* List Formatting Buttons */}
            <ToolbarButton
              active={editor.isActive('bulletList')}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
              }}
            >
              <ListDashesIcon />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('orderedList')}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
              }}
            >
              <ListNumbersIcon />
            </ToolbarButton>

            {/* Link Management Buttons */}
            <ToolbarButton
              onClick={() => {
                setLink(editor.getAttributes('link').href ?? '');
                linkPopover.handleOpen();
              }}
              ref={linkPopover.anchorRef}
            >
              <LinkIcon />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('link')}
              disabled={!editor.can().chain().focus().unsetLink().run()}
              onClick={() => {
                editor.chain().focus().unsetLink().run();
              }}
            >
              <LinkBreakIcon />
            </ToolbarButton>
          </Stack>
        ) : null}
      </Stack>

      {/* Link URL Input Popover */}
      <Popover
        anchorEl={linkPopover.anchorRef.current}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={() => {
          linkPopover.handleClose();
          setLink('');
        }}
        open={linkPopover.open}
        slotProps={{ paper: { sx: { p: 2 } } }}
      >
        <FormControl>
          <InputLabel>URL</InputLabel>
          <OutlinedInput
            name="url"
            onChange={(event) => {
              setLink(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key !== 'Enter') {
                return;
              }

              if (link === '') {
                editor?.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }

              editor?.chain().focus().setLink({ href: link }).run();
              linkPopover.handleClose();
              setLink('');
            }}
            value={link}
          />
        </FormControl>
      </Popover>
    </React.Fragment>
  );
}

/**
 * Gets the current font value (heading level or paragraph) from the editor
 * 
 * @param {Object} editor - The TipTap editor instance
 * @returns {string} The current font value ('p' or 'h1' through 'h6')
 */
function getFontValue(editor) {
  return editor.isActive('paragraph')
    ? 'p'
    : editor.isActive('heading', { level: 1 })
      ? 'h1'
      : editor.isActive('heading', { level: 2 })
        ? 'h2'
        : editor.isActive('heading', { level: 3 })
          ? 'h3'
          : editor.isActive('heading', { level: 4 })
            ? 'h4'
            : editor.isActive('heading', { level: 5 })
              ? 'h5'
              : editor.isActive('heading', { level: 6 })
                ? 'h6'
                : 'p';
}

/**
 * Toolbar Button Component
 * 
 * A reusable button component for the toolbar that handles active state
 * and disabled state styling.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether the button is in active state
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} A styled toolbar button
 */
const ToolbarButton = React.forwardRef(function ToolbarButton({ active, children, disabled, onClick }, ref) {
  return (
    <IconButton color={active ? 'primary' : 'secondary'} disabled={disabled} onClick={onClick} ref={ref}>
      {children}
    </IconButton>
  );
});
