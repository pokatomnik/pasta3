import { env } from 'process';
import { connect, Mongoose } from 'mongoose';

export class MongoDBConnection {
  private static instance: MongoDBConnection | null = null;

  private static getInstance(): MongoDBConnection {
    return this.instance || (this.instance = new MongoDBConnection());
  }

  private readonly connected: Promise<Mongoose>;

  private constructor() {
    const connectionString = env.MONGODB_URI;
    if (typeof connectionString !== 'string') {
      throw new Error('Empty MongoDB connection string');
    }
    this.connected = connect(connectionString);
  }

  public static async requireConnected<R extends unknown>(fn: () => R) {
    await MongoDBConnection.getInstance().connected;
    return fn();
  }
}
