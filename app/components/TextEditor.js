import React, { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

import { Button, IconButton, Box } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Link as LinkIcon,
  InsertPhoto as InsertPhotoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTheme } from '@emotion/react';

const TextEditor = ({ cta, onCtaClick, initialContent = '' }) => {
  const [attachments, setAttachments] = useState([]);
  const theme = useTheme()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        protocols: ['ftp', 'mailto'],
      }),
      Image,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'custom-editor',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resource', 'contact');

    try {
      const res = { file: { id: '123', url: 'https://example.com/file', type: file.type } };
      setAttachments((prev) => [...prev, res.file]);
      alert('File uploaded successfully.');
    } catch (error) {
      alert('Error uploading file.');
    }
  };

  const handleButtonClick = () => {
    if (!editor || editor.isEmpty) {
      alert('Empty text');
      return;
    }

    const noteDetails = {
      plainText: editor.getText(),
      html: editor.getHTML(),
    };
    onCtaClick(noteDetails, attachments);
    editor.commands.clearContent();
    setAttachments([]);
  };

  return (
    <Box className="mt-1">
      <Box className="py-3 px-4 my-3 border rounded">
        <Box sx={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap', mb: 2 }}>
          <IconButton
            onClick={() => editor && editor.chain().focus().toggleBold().run()}
            sx={{
              color: editor?.isActive('bold')
                ? theme.palette.primary.main 
                : theme.palette.mode === 'dark'
                ? theme.palette.primary.main 
                : theme.palette.text.secondary,
            }}
          >
            <FormatBold />
          </IconButton>
          <IconButton
            onClick={() => editor && editor.chain().focus().toggleItalic().run()}            
            sx={{
              color: editor?.isActive('italic')
                ? theme.palette.primary.main
                : theme.palette.mode === 'dark'
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            <FormatItalic />
          </IconButton>
          <IconButton
            onClick={() => editor && editor.chain().focus().toggleUnderline().run()}
            sx={{
              color: editor?.isActive('underline')
                ? theme.palette.primary.main
                : theme.palette.mode === 'dark'
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            <FormatUnderlined />
          </IconButton>
          <IconButton
            onClick={() => editor && editor.chain().focus().setTextAlign('left').run()}
            sx={{
              color: editor?.isActive('textAlign', { textAlign: 'left' })
                ? theme.palette.primary.main
                : theme.palette.mode === 'dark'
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            <FormatAlignLeft />
          </IconButton>
          <IconButton
            onClick={() => editor && editor.chain().focus().setTextAlign('center').run()}
            sx={{
              color: editor?.isActive('textAlign', { textAlign: 'center' })
                ? theme.palette.primary.main
                : theme.palette.mode === 'dark'
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            <FormatAlignCenter />
          </IconButton>
          <IconButton
            onClick={() => editor && editor.chain().focus().setTextAlign('right').run()}
            sx={{
              color: editor?.isActive('textAlign', { textAlign: 'right' })
                ? theme.palette.primary.main
                : theme.palette.mode === 'dark'
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            <FormatAlignRight />
          </IconButton>
          <IconButton
            onClick={() => editor && editor.chain().focus().toggleLink({ href: window.prompt('URL') }).run()}
            sx={{
              color: editor?.isActive('link')
                ? theme.palette.primary.main
                : theme.palette.mode === 'dark'
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            <LinkIcon />
          </IconButton>
        </Box>

        <Box
          onClick={() => editor?.view?.focus()}
          sx={{ minHeight: '50vh', border: 'solid 0.5px #ee8822', 
          borderRadius: 1, p: 2, mb: 2 
        }}
        >
          <EditorContent editor={editor} style={{
            outline: 'none',
          }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleButtonClick}>
            {cta}
          </Button>
          <IconButton onClick={() => editor?.commands?.clearContent()} color="default" sx={{ mt: 2 }}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {attachments.map((attachment) => (
            <span
              key={attachment.id}
              className="avatar avatar-rounded avatar-sm d-flex justify-content-center align-items-center bg-theme-danger"
            >
              <span className="avatar-initials fw-normal d-flex justify-content-center align-items-center">
                {attachment.type}
              </span>
            </span>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TextEditor;
