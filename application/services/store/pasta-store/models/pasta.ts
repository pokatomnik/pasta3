import { model, Schema, models } from 'mongoose';

const MODEL_NAME = 'pasta';

const PastaSchema = new Schema({
  email: String,
  name: String,
  content: String,
  dateCreated: Number,
  encrypted: Boolean,
});

export const PastaModel = models[MODEL_NAME] ?? model(MODEL_NAME, PastaSchema);
