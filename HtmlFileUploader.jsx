import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $createHeadingNode,
  $createListNode,
  $createListItemNode,
  $getRoot
} from 'lexical';

function HtmlFileUploader() {
  const [editor] = useLexicalComposerContext();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert('Please upload a valid HTML file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const htmlContent = e.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const body = doc.body;

        if (!body) {
          console.error("❌ Failed to parse HTML body.");
          return;
        }

        editor.update(() => {
          const root = $getRoot();
          root.clear();

          const walkDOM = (domNode, lexicalParent) => {
            for (let child of domNode.childNodes) {
              if (child.nodeType === 3) {
                const text = child.textContent.trim();
                if (text) {
                  const textNode = $createTextNode(text);
                  const pNode = $createParagraphNode();
                  pNode.append(textNode);
                  lexicalParent.append(pNode);
                }
              } else if (child.nodeType === 1) {
                const tag = child.tagName.toLowerCase();
                let lexicalNode = null;

                switch (tag) {
                  case 'p':
                  case 'div':
                    lexicalNode = $createParagraphNode();
                    lexicalNode.append($createTextNode(child.textContent));
                    break;

                  case 'h1':
                  case 'h2':
                  case 'h3':
                    lexicalNode = $createHeadingNode(tag);
                    lexicalNode.append($createTextNode(child.textContent));
                    break;

                  case 'ul':
                  case 'ol':
                    lexicalNode = $createListNode(tag === 'ul' ? 'bullet' : 'number');
                    for (let li of child.children) {
                      if (li.tagName.toLowerCase() === 'li') {
                        const item = $createListItemNode();
                        item.append($createTextNode(li.textContent));
                        lexicalNode.append(item);
                      }
                    }
                    break;

                  case 'br':
                    lexicalNode = $createParagraphNode();
                    break;

                  case 'span':
                    lexicalNode = $createParagraphNode();
                    lexicalNode.append($createTextNode(child.textContent));
                    break;

                  default:
                    console.warn("🚫 Unsupported tag ignored:", tag);
                }

                if (lexicalNode) {
                  lexicalParent.append(lexicalNode);
                  walkDOM(child, lexicalNode);
                }
              }
            }
          };

          walkDOM(body, root);
          console.log("✅ HTML rendering complete.");
        });
      } catch (err) {
        console.error("💥 Error parsing HTML:", err);
        alert("Error while rendering HTML: " + err.message);
      }
    };

    reader.onerror = (err) => {
      console.error("❌ FileReader error:", err);
      alert("Failed to read HTML file.");
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
        accept=".html"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default HtmlFileUploader;
