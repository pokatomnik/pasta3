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
}

export type PastaCreateModel = Omit<Pasta, 'id'>;
