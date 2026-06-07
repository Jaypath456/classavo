import React, { useCallback, useMemo } from 'react';
import { createEditor, Transforms, Editor, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import './PlateEditor.css';

// Default empty document structure (Plate.js compatible JSON format)
export const emptyDocument = [
  { type: 'paragraph', children: [{ text: '' }] }
];

// ─── Toolbar Button ────────────────────────────────────────────
function ToolbarButton({ active, onMouseDown, children, title }) {
  return (
    <button
      className={`toolbar-btn ${active ? 'active' : ''}`}
      onMouseDown={onMouseDown}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

// ─── Mark helpers ──────────────────────────────────────────────
const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// ─── Block helpers ─────────────────────────────────────────────
const LIST_TYPES = ['bulleted-list', 'numbered-list'];

const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );
  return !!match;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  });

  const newType = isActive ? 'paragraph' : isList ? 'list-item' : format;
  Transforms.setNodes(editor, { type: newType });

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type: format, children: [] });
  }
};

// ─── Toolbar ───────────────────────────────────────────────────
function Toolbar() {
  const editor = useSlate();

  return (
    <div className="editor-toolbar">
      <ToolbarButton
        active={isMarkActive(editor, 'bold')}
        onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, 'bold'); }}
        title="Bold"
      >
        <b>B</b>
      </ToolbarButton>

      <ToolbarButton
        active={isMarkActive(editor, 'italic')}
        onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, 'italic'); }}
        title="Italic"
      >
        <i>I</i>
      </ToolbarButton>

      <ToolbarButton
        active={isMarkActive(editor, 'underline')}
        onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, 'underline'); }}
        title="Underline"
      >
        <u>U</u>
      </ToolbarButton>

      <ToolbarButton
        active={isMarkActive(editor, 'code')}
        onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, 'code'); }}
        title="Inline Code"
      >
        {'</>'}
      </ToolbarButton>

      <span className="toolbar-divider" />

      <ToolbarButton
        active={isBlockActive(editor, 'heading-one')}
        onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, 'heading-one'); }}
        title="Heading 1"
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'heading-two')}
        onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, 'heading-two'); }}
        title="Heading 2"
      >
        H2
      </ToolbarButton>

      <span className="toolbar-divider" />

      <ToolbarButton
        active={isBlockActive(editor, 'bulleted-list')}
        onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, 'bulleted-list'); }}
        title="Bullet List"
      >
        • List
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'numbered-list')}
        onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, 'numbered-list'); }}
        title="Numbered List"
      >
        1. List
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'block-quote')}
        onMouseDown={(e) => { e.preventDefault(); toggleBlock(editor, 'block-quote'); }}
        title="Quote"
      >
        ❝
      </ToolbarButton>
    </div>
  );
}

// ─── Element Renderer ──────────────────────────────────────────
function Element({ attributes, children, element }) {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

// ─── Leaf Renderer ─────────────────────────────────────────────
function Leaf({ attributes, children, leaf }) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.code) children = <code>{children}</code>;
  return <span {...attributes}>{children}</span>;
}

// ─── Main Editor ───────────────────────────────────────────────
export default function PlateEditor({ value, onChange, readOnly = false }) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue = useMemo(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return emptyDocument;
    }
    return value;
  }, []); // only on mount

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  if (readOnly) {
    return (
      <Slate editor={editor} initialValue={initialValue} onChange={() => {}}>
        <div className="editor-readonly">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            readOnly
          />
        </div>
      </Slate>
    );
  }

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(newValue) => {
        if (onChange) onChange(newValue);
      }}
    >
      <div className="editor-wrapper">
        <Toolbar />
        <div className="editor-body">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Start writing your chapter content..."
            spellCheck
            autoFocus
          />
        </div>
      </div>
    </Slate>
  );
}
