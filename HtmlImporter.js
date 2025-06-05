import {
  $createParagraphNode,
  $createTextNode,
  $createHeadingNode,
  $createListNode,
  $createListItemNode,
  $getRoot
} from 'lexical';

import { $createTableRowNode } from './nodes/TableRowNode';
import { $createTableCellNode } from './nodes/TableCellNode';
import { $createImageNode } from './nodes/ImageNode';
import { $createLinkNode } from './nodes/LinkNode';
import { $createTableNode } from './nodes/TableNode';

export function importHtmlToLexical(editor, htmlContent) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const body = doc.body;

    if (!body) {
      console.error('❌ Failed to parse HTML body.');
      return;
    }

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      walkDOM(body, root);
      console.log('✅ HTML import completed.');
    });
  } catch (err) {
    console.error('💥 Error parsing HTML:', err);
    alert('Error while rendering HTML: ' + err.message);
  }
}

function walkDOM(domNode, lexicalParent) {
  for (let child of domNode.childNodes) {
    if (child.nodeType === 3) {
      const text = child.textContent.trim();
      if (text) {
        const textNode = $createTextNode(text);
        const paragraphNode = $createParagraphNode();
        paragraphNode.append(textNode);
        lexicalParent.append(paragraphNode);
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

        case 'table':
          lexicalNode = $createTableNode();
          for (let tr of child.querySelectorAll('tr')) {
            const rowNode = $createTableRowNode();
            for (let td of tr.querySelectorAll('td, th')) {
              const cellNode = $createTableCellNode();
              cellNode.append($createTextNode(td.textContent));
              rowNode.append(cellNode);
            }
            lexicalNode.append(rowNode);
          }
          break;

        case 'img':
          const src = child.getAttribute('src');
          if (src) {
            lexicalNode = $createImageNode(src);
          }
          break;

        case 'a':
          const href = child.getAttribute('href');
          const text = child.textContent || href;
          if (href) {
            lexicalNode = $createLinkNode(href, text);
          }
          break;

        case 'hr':
          lexicalNode = $createParagraphNode();
          lexicalNode.append($createTextNode('────────────'));
          break;

        default:
          console.warn(`🚫 Unsupported tag ignored: <${tag}>`);
          lexicalNode = $createParagraphNode();
          lexicalNode.append($createTextNode(`[${tag} not supported]`));
      }

      if (lexicalNode) {
        lexicalParent.append(lexicalNode);
        if (lexicalNode.getChildren) {
          walkDOM(child, lexicalNode);
        }
      }
    }
  }
}
