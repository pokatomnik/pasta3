import type { Pasta } from '../../../../domain/pasta';

export type PastaData = Omit<Pasta, '_id' | 'email' | 'dateCreated'>;
