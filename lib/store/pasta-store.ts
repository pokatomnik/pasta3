import type { Pasta } from '../../domain/pasta';

export interface IPastaStore {
  readonly identifierLength: number;
  createPasta(
    email: string,
    name: string,
    content: string,
    encrypted: boolean
  ): Promise<Pasta>;
  getPasta(email: string, id: string): Promise<Pasta | null>;
  getPastas(email: string, from: number, limit: number): Promise<Array<Pasta>>;
  deletePasta(email: string, id: string): Promise<void>;
}
