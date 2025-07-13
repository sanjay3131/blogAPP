declare module "tinymce" {
  export interface Editor {
    getContent(): string;
    setContent(content: string): void;
    // Add more only if needed
  }
}
