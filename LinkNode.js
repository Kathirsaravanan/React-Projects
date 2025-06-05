import { DecoratorNode } from 'lexical';
import * as React from 'react';

export class LinkNode extends DecoratorNode {
  constructor(href, text, key) {
    super(key);
    this.__href = href;
    this.__text = text;
  }

  static getType() {
    return 'link';
  }

  static clone(node) {
    return new LinkNode(node.__href, node.__text, node.__key);
  }

  createDOM() {
    return document.createElement('div');
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <a
        href={this.__href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {this.__text}
      </a>
    );
  }

  static importJSON({ href, text }) {
    return new LinkNode(href, text);
  }

  exportJSON() {
    return {
      type: 'link',
      version: 1,
      href: this.__href,
      text: this.__text,
    };
  }
}

export function $createLinkNode(href, text) {
  return new LinkNode(href, text);
}

export function $isLinkNode(node) {
  return node instanceof LinkNode;
}
