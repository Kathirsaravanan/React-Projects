import { ElementNode } from 'lexical';

export class TableCellNode extends ElementNode {
  static getType() {
    return 'table-cell';
  }

  static clone(node) {
    return new TableCellNode(node.__key);
  }

  createDOM() {
    const cell = document.createElement('td');
    cell.className = 'border border-gray-300 px-2 py-1';
    return cell;
  }

  updateDOM(prevNode, dom) {
    return false;
  }

  static importJSON(serializedNode) {
    return new TableCellNode();
  }

  exportJSON() {
    return {
      type: 'table-cell',
      version: 1,
    };
  }
}

export function $createTableCellNode() {
  return new TableCellNode();
}

export function $isTableCellNode(node) {
  return node instanceof TableCellNode;
}
