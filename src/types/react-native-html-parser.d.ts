declare module 'react-native-html-parser' {
  export class DOMParser {
    parseFromString(html: string, type: string): Document;
  }

  export class Document {
    getElementsByTagName(tagName: string): Element[];
    getElementsByClassName(className: string): Element[];
  }

  export class Element {
    getAttribute(name: string): string | null;
    getElementsByClassName(className: string): Element[];
    textContent: string | null;
  }
} 