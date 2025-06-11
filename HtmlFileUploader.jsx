
import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { $createTextNode } from 'lexical';
import { $createStyledElementNode } from './StyledElementNode';

function HtmlFileUploader() {
  const [editor] = useLexicalComposerContext();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(reader.result, 'text/html');

      editor.update(() => {
        const root = $getRoot();
        root.clear();
        walkDOM(doc.body, root);
      });
    };

    reader.readAsText(file);
  };

  const walkDOM = (domNode, lexicalParent) => {
    domNode.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent;
        if (textContent) {
          lexicalParent.append($createTextNode(textContent));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const style = node.getAttribute('style') || '';
        const href = tag === 'a' ? node.getAttribute('href') || '' : '';

        if (tag === 'br') {
          lexicalParent.append($createStyledElementNode('', 'br'));
        } else {
          const elementNode = $createStyledElementNode(style, tag, href);
          lexicalParent.append(elementNode);
          walkDOM(node, elementNode);
        }
      }
    });
  };

  return (
    <div>
      <input type="file" accept=".html" onChange={handleFileChange} />
    </div>
  );
}

export default HtmlFileUploader;
