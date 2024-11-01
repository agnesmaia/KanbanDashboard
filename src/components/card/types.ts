import { Id } from '../column-section/types.ts';

export type Card = {
  id: string;
  title: string;
  description: string;
  order: number;
  columnId: Id;
};
