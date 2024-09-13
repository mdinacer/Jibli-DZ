import React, { useCallback } from 'react';

import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import TextareaField from '@/components/fields/TextareaField';
import {
  ListItem,
  ListItemInput,
  ListItemInputSchema
} from '@/models/ListItem';
import { ProductUnitsList } from '@/models/ProductUnit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet } from '@tamagui/sheet';
import { useForm } from 'react-hook-form';
import { Button, Form, Spinner, YStack } from 'tamagui';

interface Props {
  item?: ListItem;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: ListItemInput) => void;
}

const ItemForm: React.FC<Props> = ({ item, open, setOpen, onSubmit }) => {
  const [position, setPosition] = React.useState(0);

  const form = useForm<ListItemInput>({
    resolver: zodResolver(ListItemInputSchema),
    defaultValues: {
      name: item?.name || '',
      quantity: item?.quantity,
      unit: item?.unit,
      note: item?.note
    }
  });

  const {
    control,
    formState: { isSubmitting, isLoading },
    handleSubmit,
    reset
  } = form;

  const handleOnSubmit = useCallback(
    async (data: ListItemInput) => {
      try {
        console.log(data);
        onSubmit(data);
        reset();
      } catch (error: any) {
        console.error(error);
      }
    },
    [onSubmit, reset]
  );

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={false}
      open={open}
      onOpenChange={setOpen}
      //snapPoints={['80%', 256, 190]}
      snapPointsMode={'fit'}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />

      <Sheet.Frame padding="$4" gap="$5">
        <Form
          flex={1}
          minWidth={300}
          gap="$4"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <InputField
            name="name"
            label="Name"
            control={control}
            placeholder="Type the item name"
          />

          <SelectField
            data={ProductUnitsList}
            name="unit"
            label="Unit"
            control={control}
            placeholder="Select a unit"
          />

          <TextareaField
            name="note"
            label="Note"
            size="$4"
            control={control}
            placeholder="Type a note"
          />

          <YStack width={'100%'} rowGap="$4">
            <Form.Trigger asChild disabled={isLoading || isSubmitting}>
              <Button
                width={'100%'}
                icon={isSubmitting ? () => <Spinner /> : undefined}
              >
                Save
              </Button>
            </Form.Trigger>
          </YStack>
        </Form>
      </Sheet.Frame>
    </Sheet>
  );
};

export default ItemForm;
