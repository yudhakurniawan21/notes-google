"use client"; // only in App Router

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Italic,
  Essentials,
  Heading,
  Paragraph,
  BlockQuote,
  Link,
  List,
  Alignment,
  CodeBlock,
  Image,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface CustomEditorProps {
  onEditorChange: (data: string) => void; // Definisikan tipe fungsi
  initialValue?: string; // Opsional untuk nilai awal
}

function CustomEditor({ onEditorChange, initialValue }: CustomEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "heading",
            "|",
            "bulletedList",
            "numberedList",
            "alignment",
            "|",
            "link",
            "blockquote",
            "codeBlock",
            "|",
            "insertImage",
          ],
        },
        plugins: [
          Essentials,
          Bold,
          Italic,
          Heading,
          Paragraph,
          BlockQuote,
          Link,
          List,
          Alignment,
          CodeBlock,
          Image,
          Undo,
        ],
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
          ],
        },
        alignment: {
          options: ["left", "center", "right", "justify"],
        },
        image: {
          toolbar: [
            "imageTextAlternative",
            "imageStyle:full",
            "imageStyle:side",
          ],
        },
        placeholder: "Start typing your notes here...",
      }}
      data={initialValue || ""} // Set initial data
      onChange={(event, editor) => {
        const data = editor.getData(); // Get data from editor
        onEditorChange(data); // Pass data to parent
      }}
    />
  );
}

export default CustomEditor;
