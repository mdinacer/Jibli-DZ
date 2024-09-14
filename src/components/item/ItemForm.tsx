import React, { useCallback } from 'react';

import InputField from '@/components/fields/InputField';
import {
  ListItem,
  ListItemInput,
  ListItemInputSchema
} from '@/models/ListItem';
import { ProductUnit, ProductUnitsList } from '@/models/ProductUnit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import AppButton from '../AppButton';
import ButtonsSelectField from '../fields/ButtonSelectField';
import NumberInputField from '../fields/NumberInputField';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card';

interface Props {
  item?: ListItem;
  onSubmit: (data: ListItemInput) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<Props> = ({ item, onSubmit, onCancel }) => {
  const form = useForm<ListItemInput>({
    resolver: zodResolver(ListItemInputSchema),
    defaultValues: item
      ? ListItemInputSchema.parse(item, {
          path: ['name', 'quantity', 'unit', 'note']
        })
      : {
          name: '',
          quantity: 0,
          unit: ProductUnit.PIECE,
          note: ''
        }
  });

  const {
    control,
    formState: { isSubmitting, isValid, isDirty, errors },
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
    <View className="">
      <CardHeader>
        <CardTitle>Add Item</CardTitle>
        <CardDescription>Type item details</CardDescription>
      </CardHeader>
      <CardContent style={{ rowGap: 24 }}>
        <InputField
          name="name"
          label="Name"
          control={control}
          placeholder="Type the item name"
        />
        <NumberInputField
          name="quantity"
          clearTextOnFocus
          label="Quantity"
          control={control}
          placeholder="Type the item name"
          keyboardType="number-pad"
        />

        <ButtonsSelectField
          control={control}
          name="unit"
          label="Unit"
          items={ProductUnitsList}
        />
        <InputField
          name="note"
          label="Note"
          control={control}
          placeholder="Type the item note"
          multiline
          numberOfLines={3}
        />
      </CardContent>

      <CardFooter className="flex-col gap-y-4">
        <AppButton
          className="w-full"
          onPress={handleSubmit(handleOnSubmit)}
          //disabled={isSubmitting || !isValid}
        >
          Add
        </AppButton>
        <AppButton
          className="w-full"
          variant="outline"
          onPress={onCancel}
          disabled={isSubmitting}
        >
          {isDirty ? 'Cancel' : 'Back'}
        </AppButton>
      </CardFooter>
    </View>
  );
};

export default ItemForm;
