import noop from 'lodash/noop';

export enum Mime {
  TEXT_CSV = 'text/csv',
}

export interface Cleanup {
  cleanup: () => void;
}

export class Downloader {
  private isLegacyBrowser() {
    return (
      'msSaveOrOpenBlob' in window.navigator && 'msSaveBlob' in window.navigator
    );
  }

  private downloadBlobLegacy(blob: Blob, filename: string) {
    (
      window.navigator as unknown as {
        msSaveBlob: (blob: Blob, filename: string) => void;
      }
    ).msSaveBlob(blob, filename);
  }

  private createHiddenAnchor() {
    const elem = document.createElement('a');
    elem.style.position = 'absolute';
    elem.style.left = '-9999px';
    elem.style.top = '-9999px';
    elem.style.width = '0px';
    elem.style.height = '0px';
    elem.style.opacity = '0';
    return elem;
  }

  public download(
    data: string,
    filename: string,
    mime: Mime = Mime.TEXT_CSV
  ): Cleanup {
    const blob = new Blob([data], { type: mime });
    if (this.isLegacyBrowser()) {
      this.downloadBlobLegacy(blob, filename);
      return { cleanup: noop };
    }

    const anchor = this.createHiddenAnchor();
    const objectURL = window.URL.createObjectURL(blob);
    anchor.href = objectURL;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    return {
      cleanup: () => {
        URL.revokeObjectURL(objectURL);
      },
    };
  }
}
