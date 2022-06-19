export interface Copier {
  copyText(text: string): Promise<void>;
}
