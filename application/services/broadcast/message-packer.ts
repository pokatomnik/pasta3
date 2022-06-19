interface IPackedObject {
  id: string;
  message: string;
}

export class MessagePacker {
  private readonly id = Math.random().toString(36).slice(2);

  public packMessage(
    message: string,
    handler: (packedMessage: string) => void
  ) {
    const packedObject: IPackedObject = {
      id: this.id,
      message,
    };
    const packedMessage = JSON.stringify(packedObject);
    handler(packedMessage);
  }

  public handleMessage(
    packedMessage: string,
    handler: (message: string) => void
  ) {
    const unpackedMessage: IPackedObject = JSON.parse(packedMessage);
    if (unpackedMessage.id !== this.id) {
      handler(unpackedMessage.message);
    }
  }
}
