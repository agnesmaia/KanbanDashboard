import { ColumnContainer } from '../column-container';
import { kanbanMock } from '../../mocks/kanban-mock';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Box, Button, cardClasses, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from '../../types/index.ts';
import { findColumnContainer } from '../../utils/index.ts';
import { COLUMN_DATA } from '../column-container/constants.ts';

export function KanbanBoard() {
  const methods = useForm({
    defaultValues: kanbanMock,
  });

  const [cards, setCards] = useState(kanbanMock);

  const { handleSubmit, control } = methods;
  const { fields } = useFieldArray({
    control,
    name: 'cards',
  });

  const onSubmit = (data) => {
    localStorage.setItem('kanbanData', JSON.stringify(data));
  };

  useEffect(() => {
    const storedData = localStorage.getItem('kanbanData');
    if (storedData) {
      methods.reset(JSON.parse(storedData));
    }
  }, [methods]);

  const [columnContainers, setColumnContainers] = useState<Column>(COLUMN_DATA);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>();

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeContainer = findColumnContainer(cards, active.id as string);

    const overContainer = findColumnContainer(cards, over?.id as string);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }
    setCards((cards) => {
      const activeItems = cards[activeContainer];
      const overItems = cards[overContainer];
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);
      const newColumns = {
        ...cards,
        [activeContainer]: [
          ...cards[activeContainer].filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...cards[overContainer].slice(0, overIndex),
          cards[activeContainer][activeIndex],
          ...cards[overContainer].slice(overIndex, cards[overContainer].length),
        ],
      };
      return newColumns;
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findColumnContainer(cards, active.id as string);
    const overContainer = findColumnContainer(cards, over?.id as string);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = cards[activeContainer].findIndex(
      (card) => card.id === active.id
    );
    const overIndex = cards[overContainer].findIndex(
      (card) => card.id === over?.id
    );

    console.log(activeIndex, overIndex);

    if (activeIndex !== overIndex) {
      setCards((cards) => ({
        ...cards,
        [overContainer]: arrayMove(
          cards[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // const dropAnimation: DropAnimation = {
  //   ...defaultDropAnimation,
  // };

  // const card = activeId ? getCardById(cards, activeId) : null;

  return (
    <FormProvider {...methods}>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '12px',
          width: '100vw',
          gap: '1.5rem',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            color="black"
            fontFamily="Roboto"
            fontSize="32px"
            fontWeight="400"
          >
            Quadro Pedido Pago
          </Typography>
          <Button
            variant="outlined"
            style={{ color: 'black', borderColor: '#F5F5F5' }}
            onClick={handleSubmit(onSubmit)}
          >
            Salvar Alterações
          </Button>
        </Box>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Container
            sx={{
              backgroundColor: '#F8F8F8',
              display: 'flex',
              borderRadius: '8px',
            }}
          >
            {columnContainers.map((columnKey) => {
              return (
                <ColumnContainer
                  title={columnKey.title}
                  id={columnKey.columnName}
                  backgroundColor={columnKey.backgroundColor}
                  cards={cards[columnKey.columnName] as any}
                />
              );
            })}
            {/* <DragOverlay dropAnimation={dropAnimation}>
              {card ? <CardItem card={card} /> : null}
            </DragOverlay> */}
          </Container>
        </DndContext>
      </Container>
    </FormProvider>
  );
}
