import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { importHtmlToLexical } from './HtmlImporter';

function HtmlFileUploader() {
  const [editor] = useLexicalComposerContext();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert('⚠️ Please upload a valid HTML/HTM file.');
      return;
    }

    const isHtmlFile = /\.(html?|HTML?)$/.test(file.name);
    if (!isHtmlFile) {
      alert('❌ Unsupported file type. Please upload only .html or .htm files.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const htmlContent = e.target.result;
      console.log('📥 File read successfully, processing HTML...');
      importHtmlToLexical(editor, htmlContent);
    };

    reader.onerror = (err) => {
      console.error('❌ FileReader error:', err);
      alert('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  };

  return (
    <div className="my-2">
      <label htmlFor="html-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
        Upload HTML File
      </label>
      <input
        id="html-upload"
        type="file"
        accept=".html,.htm"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default HtmlFileUploader;
