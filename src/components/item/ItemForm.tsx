import React, { useCallback } from 'react';

import InputField from '@/components/fields/InputField';
import {
  ListItem,
  ListItemInput,
  ListItemInputSchema
} from '@/models/ListItem';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, View } from 'react-native';

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
    <View>
      <InputField
        name="name"
        label="Name"
        control={control}
        placeholder="Type the item name"
      />

      <View>
        <Button title="Save"></Button>
      </View>
    </View>
  );
};

export default ItemForm;
