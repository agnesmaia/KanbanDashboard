import { Typography, Container, Box, IconButton } from '@mui/material';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import CardItem from '../card/index.tsx';
import SortableCard from '../sortable-card/index.tsx';
import { CardType } from '../../types/index.ts';
import { useFieldArray, useForm } from 'react-hook-form';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

type ColumnContainerProps = {
  title: string;
  id: string;
  backgroundColor: string;
  cards: CardType[];
};

export function ColumnContainer({
  title,
  id,
  backgroundColor,
  cards,
}: ColumnContainerProps) {
  // const { control } = useForm({
  //   defaultValues: {
  //     cards: cards,
  //   },
  // });
  // const { fields, append } = useFieldArray({ control, name: 'cards' });
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <Container
      ref={setNodeRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        margin: '16px',
        width: '250px',
        gap: '1rem',
      }}
    >
      <Box
        sx={{
          backgroundColor: backgroundColor,
          width: 'fit-content',
          padding: '0 0.5rem',
          borderRadius: '20px',
        }}
      >
        <Typography variant="subtitle1" color="#4D4D4D">
          {title}
        </Typography>
      </Box>

      <SortableContext items={cards} strategy={verticalListSortingStrategy}>
        {cards.map((card) => (
          <Box key={card.id} sx={{ mb: 2 }}>
            <SortableCard id={card.id}>
              <CardItem
                card={card}
                onTitleChange={(value) => {
                  card.title = value;
                }}
                onDescriptionChange={(value) => {
                  card.description = value;
                }}
              />
            </SortableCard>
          </Box>
        ))}
      </SortableContext>

      <Box display="flex" justifyContent="center" border="none">
        <IconButton
          aria-label="add card"
          color="#212121"
          onClick={() => append({ id: '', title: '', description: '' })}
        >
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Box>
    </Container>
  );
}
