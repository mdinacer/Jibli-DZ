import React, { useCallback } from 'react';

import InputField from '@/components/fields/InputField';
import {
  ListItem,
  ListItemInput,
  ListItemInputSchema,
  ListItemStatus
} from '@/models/ListItem';
import { ProductUnit, ProductUnitsList } from '@/models/ProductUnit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Modal, View } from 'react-native';
import AppButton from '../AppButton';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import ButtonsSelectField from '../fields/ButtonSelectField';
import NumberInputField from '../fields/NumberInputField';
import { useUserListStore } from '@/stores/useUserListStore';
import { generateId } from '@/utils/IdGenerator';
import { Timestamp } from '@react-native-firebase/firestore';

interface Props {
  item?: ListItem;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: (data: ListItemInput) => void;
}

const ItemFormModal: React.FC<Props> = ({ item, open, setOpen, onSubmit }) => {
  const { list, updateItem, addItem } = useUserListStore();
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
    formState: { isSubmitting, isDirty },
    handleSubmit,
    reset
  } = form;

  const handleOnSubmit = useCallback(
    async (data: ListItemInput) => {
      if (!list) return;
      try {
        if (item) {
          updateItem(item.id, data);
        } else {
          const item: ListItem = {
            ...data,
            id: generateId(),
            status: ListItemStatus.PENDING,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          };

          addItem(item);
        }
        console.log(data);
        onSubmit?.(data);
        reset();
      } catch (error: any) {
        console.error(error);
      }
    },
    [addItem, item, list, onSubmit, reset, updateItem]
  );

  const handleClose = useCallback(() => {
    reset();
    setOpen(false);
  }, [reset, setOpen]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <Card className="absolute inset-x-0 bottom-0 h-auto max-h-screen w-full rounded-t-2xl bg-muted pb-4">
        <CardHeader>
          <CardTitle>Edit item</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="" style={{ rowGap: 24 }}>
            <InputField
              name="name"
              label="Name"
              control={control}
              placeholder="Type the item name"
            />
            <NumberInputField
              name="quantity"
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

            <View className="gap-y-4">
              <AppButton
                onPress={handleSubmit(handleOnSubmit)}
                //disabled={isSubmitting || !isValid}
              >
                Save
              </AppButton>
              <AppButton
                variant="outline"
                onPress={handleClose}
                disabled={isSubmitting}
              >
                {isDirty ? 'Cancel' : 'Close'}
              </AppButton>
            </View>
          </View>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ItemFormModal;
