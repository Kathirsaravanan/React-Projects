import { DecoratorNode } from 'lexical';
import * as React from 'react';

export class ImageNode extends DecoratorNode {
  constructor(src, key) {
    super(key);
    this.__src = src;
  }

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__key);
  }

  createDOM() {
    return document.createElement('div');
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <img src={this.__src} alt="Uploaded" className="max-w-full h-auto" />;
  }

  static importJSON({ src }) {
    return new ImageNode(src);
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
    };
  }
}

export function $createImageNode(src) {
  return new ImageNode(src);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
