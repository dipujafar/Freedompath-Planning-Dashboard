import dynamic from 'next/dynamic';
import { useRef } from 'react';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Constants for editor sizing
const EDITOR_HEIGHT = 200;
const TOOLBAR_HEIGHT = 42;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'size': ['small', false, 'large'] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'size', 'bold', 'italic', 'underline',
    'list', 'bullet', 'indent', 'link'
  ];

  const containerHeight = EDITOR_HEIGHT + TOOLBAR_HEIGHT;

  return (
    <div
      className="rich-text-editor-wrapper bg-[#F9FAFB] rounded-lg border"
      style={{
        height: containerHeight,
        position: 'relative',
        zIndex: 5
      }}
    >
      <style>{`
        .rich-text-editor-wrapper .quill {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .rich-text-editor-wrapper .ql-toolbar {
          flex-shrink: 0;
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 8px 8px 0 0;
          position: relative;
          z-index: 10;
        }
        .rich-text-editor-wrapper .ql-picker-options {
          z-index: 1000 !important;
          background: #fff;
        }
        .rich-text-editor-wrapper .ql-container {
          flex: 1;
          border: none;
          font-size: 14px;
          overflow: hidden !important;
        }
        .rich-text-editor-wrapper .ql-editor {
          height: 100%;
          max-height: ${EDITOR_HEIGHT}px;
          overflow-y: auto !important;
          will-change: scroll-position;
          -webkit-overflow-scrolling: touch;
        }
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar {
          width: 6px;
        }
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
      <ReactQuill
        // @ts-ignore
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(RichTextEditor), {
  ssr: false,
});
