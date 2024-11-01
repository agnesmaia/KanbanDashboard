import { Box, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardType } from '../../types/index.ts';

interface CardProps {
  card: CardType;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function CardContainer({
  card,
  onTitleChange,
  onDescriptionChange,
}: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
    });

  const handleTitleInput = (event: React.FormEvent<HTMLDivElement>) => {
    onTitleChange(event.currentTarget.textContent || '');
  };

  const handleDescriptionInput = (event: React.FormEvent<HTMLDivElement>) => {
    onDescriptionChange(event.currentTarget.textContent || '');
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: '16px',
        borderRadius: '8px',
        gap: '0.5rem',
      }}
    >
      <Typography
        component="div"
        color="black"
        fontWeight="bold"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTitleInput}
        sx={{
          cursor: 'pointer',
          outline: '1px solid transparent',
          '&:hover': { outline: '1px solid #ccc' },

          borderRadius: '4px',
        }}
        data-testid="card-title"
      >
        {card.title}
      </Typography>

      <Typography
        component="div"
        color="#4D4D4D"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleDescriptionInput}
        sx={{
          cursor: 'pointer',
          outline: '1px solid transparent',
          '&:hover': { outline: '1px solid #ccc' },

          borderRadius: '4px',
        }}
        data-testid="card-description"
      >
        {card.description}
      </Typography>
    </Box>
  );
}
