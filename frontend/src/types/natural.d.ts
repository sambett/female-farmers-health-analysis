declare module 'natural' {
  export class WordTokenizer {
    tokenize(text: string): string[] | null;
  }

  export namespace PorterStemmerFr {
    function stem(word: string): string;
  }
}
