import { DecoratorNode } from 'lexical';
import * as React from 'react';

export class SentinelNode extends DecoratorNode {
  static getType() {
    return 'sentinel';
  }

  static clone(node) {
    return new SentinelNode(node.__position, node.__key);
  }

  constructor(position, key) {
    super(key);
    this.__position = position; // 'top' or 'bottom'
  }

  createDOM() {
    const div = document.createElement('div');
    div.setAttribute('data-sentinel', this.__position);
    div.style.height = '1px';
    div.style.background = 'transparent';
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return null;
  }
}

export function $createSentinelNode(position) {
  return new SentinelNode(position);
}

export function $isSentinelNode(node) {
  return node instanceof SentinelNode;
}
