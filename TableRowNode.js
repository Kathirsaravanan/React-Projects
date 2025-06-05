import { ElementNode } from 'lexical';

export class TableRowNode extends ElementNode {
  static getType() {
    return 'table-row';
  }

  static clone(node) {
    return new TableRowNode(node.__key);
  }

  createDOM() {
    return document.createElement('tr');
  }

  updateDOM(prevNode, dom) {
    return false;
  }

  static importJSON(serializedNode) {
    return new TableRowNode();
  }

  exportJSON() {
    return {
      type: 'table-row',
      version: 1,
    };
  }
}

export function $createTableRowNode() {
  return new TableRowNode();
}

export function $isTableRowNode(node) {
  return node instanceof TableRowNode;
}
