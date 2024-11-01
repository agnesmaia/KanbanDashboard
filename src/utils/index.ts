import { COLUMN_DATA } from '../components/column-container/constants';
import { CardType, Column, Status } from '../types';

export const findColumnContainer = (columnContainer: Column, id: string) => {
  if (id in columnContainer) {
    return id;
  }

  const container = Object.keys(columnContainer).find((key) =>
    columnContainer[key].find((item) => item.id === id)
  );

  return container;
};

export const initializeBoard = (cards: CardType[]) => {
  const columnContainer: Column = {};

  Object.keys(COLUMN_DATA).forEach((columnKey) => {
    columnContainer[columnKey] = getCardsByStatus(cards, columnKey as Status);
  });

  return columnContainer;
};

export const getCardById = (cards: CardType[], id: string) => {
  return cards.find((card) => card.id === id);
};

export const getCardsByStatus = (cards: CardType[], status: Status) => {
  return cards.filter((card) => card.status === status);
};
