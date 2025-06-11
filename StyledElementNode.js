
import { ElementNode } from 'lexical';

export class StyledElementNode extends ElementNode {
  __style;
  __tag;
  __href;

  static getType() {
    return 'styled-element';
  }

  static clone(node) {
    return new StyledElementNode(node.__style, node.__tag, node.__href, node.__key);
  }

  constructor(style = '', tag = 'div', href = '', key) {
    super(key);
    this.__style = style;
    this.__tag = tag;
    this.__href = href;
  }

  createDOM(config) {
    const dom = document.createElement(this.__tag || 'div');
    if (this.__style) {
      dom.setAttribute('style', this.__style);
    }
    if (this.__tag === 'a' && this.__href) {
      dom.setAttribute('href', this.__href);
      dom.setAttribute('target', '_blank');
      dom.setAttribute('rel', 'noopener noreferrer');
    }
    return dom;
  }

  updateDOM(prevNode, dom) {
    if (prevNode.__style !== this.__style) {
      dom.setAttribute('style', this.__style);
    }
    if (this.__tag === 'a' && prevNode.__href !== this.__href) {
      dom.setAttribute('href', this.__href);
    }
    return false;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'styled-element',
      version: 1,
      style: this.__style,
      tag: this.__tag,
      href: this.__href,
    };
  }

  static importJSON(json) {
    return new StyledElementNode(json.style, json.tag || 'div', json.href || '');
  }

  exportDOM() {
    const element = document.createElement(this.__tag || 'div');
    if (this.__style) {
      element.setAttribute('style', this.__style);
    }
    if (this.__tag === 'a' && this.__href) {
      element.setAttribute('href', this.__href);
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
    }
    return {
      element,
    };
  }

  static importDOM() {
    const tags = [
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
      'div', 'a', 'span', 'section', 'article', 'header', 'footer',
      'br', 'sup', 'sub', 'mark', 'nav', 'main', 'aside'
    ];
    const conversions = {};
    tags.forEach(tag => {
      conversions[tag] = (domNode) => {
        const style = domNode.getAttribute('style') || '';
        const href = tag === 'a' ? domNode.getAttribute('href') || '' : '';
        return {
          conversion: () => new StyledElementNode(style, tag, href),
          priority: 1,
        };
      };
    });
    return conversions;
  }

  getStyle() {
    return this.__style;
  }

  setStyle(style) {
    const writable = this.getWritable();
    writable.__style = style;
  }

  getTag() {
    return this.__tag;
  }

  getHref() {
    return this.__href;
  }

  setHref(href) {
    const writable = this.getWritable();
    writable.__href = href;
  }

  isInline() {
    return [
      'a', 'span', 'sup', 'sub', 'mark', 'br'
    ].includes(this.__tag);
  }
}

export function $createStyledElementNode(style = '', tag = 'div', href = '') {
  return new StyledElementNode(style, tag, href);
}

export function $isStyledElementNode(node) {
  return node instanceof StyledElementNode;
}
