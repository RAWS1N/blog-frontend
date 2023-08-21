// @ts-nocheck

import {memo} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

interface EditorProps {
  value : string,
  setValue : (value: string) => void
}

const BlogWriterModel:React.FC<EditorProps> = ({value,setValue}) => {
  return (
    <>
      <ReactQuill
        theme="snow"
        modules={modules}
        required={true}
        formats={formats}
        value={value}
        onChange={setValue}
        name="description"
        className="blog-editor"
      />
    </>
  );
}

export default memo(BlogWriterModel);