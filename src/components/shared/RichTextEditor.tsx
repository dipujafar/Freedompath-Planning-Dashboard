import dynamic from 'next/dynamic';
import { useRef } from 'react';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

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
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'size', 'bold', 'italic', 'underline', 
    'list', 'bullet', 'indent', 'link'
  ];

  return (
    <div className="bg-[#F9FAFB] rounded-lg border">
      <ReactQuill
      // @ts-ignore
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: '200px', marginBottom: '42px', overflow: 'hidden' }}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(RichTextEditor), {
  ssr: false,
});
