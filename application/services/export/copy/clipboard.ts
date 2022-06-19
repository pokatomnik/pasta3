import noop from 'lodash/noop';
import type { Disposable } from '../../../../lib/disposable';
import type { Copier } from './copier';

export class Clipboard implements Copier, Disposable {
  private disposed = false;

  private textareaDisposable: Disposable = {
    isDisposed: false,
    dispose: noop,
  };

  private textarea: HTMLTextAreaElement | null = null;

  private createTextarea(): HTMLTextAreaElement | null {
    try {
      const textarea = document.createElement('textarea');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.width = '0px';
      textarea.style.height = '0px';
      textarea.style.opacity = '0';

      return textarea;
    } catch (e) {
      return null;
    }
  }

  public constructor(params: {
    handleTextarea: (textarea: HTMLTextAreaElement) => Disposable;
  }) {
    const textarea = this.createTextarea();
    if (textarea !== null) {
      this.textareaDisposable = params.handleTextarea(textarea);
    }
    this.textarea = textarea;
  }

  private fallbackCopyTextToClipboard(
    textarea: HTMLTextAreaElement,
    text: string
  ): boolean {
    textarea.value = text;

    textarea.focus();
    textarea.select();

    try {
      return document.execCommand('copy');
    } catch (err) {
      return false;
    } finally {
      textarea.value = '';
    }
  }

  public copyText(text: string): Promise<void> {
    if (this.disposed) {
      return Promise.reject(new Error('Clipboard already disposed'));
    }
    if (!navigator.clipboard) {
      if (this.textarea) {
        this.fallbackCopyTextToClipboard(this.textarea, text);
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Required textarea does not exist'));
      }
    } else {
      return navigator.clipboard.writeText(text);
    }
  }

  public get isDisposed() {
    return this.disposed;
  }

  public dispose() {
    this.textareaDisposable.dispose();
    this.disposed = true;
  }
}
