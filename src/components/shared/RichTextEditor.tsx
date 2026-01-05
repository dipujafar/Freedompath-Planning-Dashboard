import dynamic from 'next/dynamic';
import { useRef, useId } from 'react';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const quillRef = useRef(null);
  const editorId = useId();

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

  return (
    <>
      <style>{`
        .rich-text-editor-${editorId.replace(/:/g, '')} .ql-container {
          height: 160px;
          overflow: visible;
        }
        .rich-text-editor-${editorId.replace(/:/g, '')} .ql-editor {
          overflow-y: auto;
          max-height: 160px;
          will-change: scroll-position;
          -webkit-overflow-scrolling: touch;
        }
        .rich-text-editor-${editorId.replace(/:/g, '')} .ql-editor::-webkit-scrollbar {
          width: 6px;
        }
        .rich-text-editor-${editorId.replace(/:/g, '')} .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .rich-text-editor-${editorId.replace(/:/g, '')} .ql-editor::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
      `}</style>
      <div className={`bg-[#F9FAFB] rounded-lg border rich-text-editor-${editorId.replace(/:/g, '')}`}>
        <ReactQuill
          // @ts-ignore
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ marginBottom: '42px' }}
        />
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(RichTextEditor), {
  ssr: false,
});
