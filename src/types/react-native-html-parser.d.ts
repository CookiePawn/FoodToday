declare module 'react-native-html-parser' {
  export class DOMParser {
    parseFromString(html: string, type: string): Document;
  }

  export class Document {
    getElementsByClassName(className: string): Element[];
  }

  export class Element {
    getElementsByClassName(className: string): Element[];
    textContent: string | null;
  }
} 