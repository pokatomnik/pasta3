export interface Pasta {
  readonly _id: string;
  /**
   * User email
   */
  readonly email: string;
  /**
   * Pasta name
   */
  readonly name: string;
  /**
   * Pasta content
   */
  readonly content: string;
  /**
   * Date created, timestamp
   */
  readonly dateCreated: number;
  /**
   * Is it encrypted
   */
  readonly encrypted?: boolean;
}

export type PastaCreateModel = Omit<Pasta, 'id'>;
