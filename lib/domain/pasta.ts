export interface Pasta {
  id: string;
  /**
   * User email
   */
  email: string;
  /**
   * Pasta name
   */
  name: string;
  /**
   * Pasta content
   */
  content: string;
  /**
   * Date created, timestamp
   */
  dateCreated: number;
}

export type PastaCreateModel = Omit<Pasta, 'id'>;
