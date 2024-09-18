import React, { useCallback, useMemo } from 'react';

import InputField from '@/components/fields/InputField';
import {
  ListItem,
  ListItemInput,
  ListItemInputSchema,
  ListItemStatus
} from '@/models/ListItem';
import { ProductUnit } from '@/models/ProductUnit';
import { useUserListStore } from '@/stores/useUserListStore';
import { generateId } from '@/utils/IdGenerator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Timestamp } from '@react-native-firebase/firestore';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Modal, View } from 'react-native';
import AppButton from '../AppButton';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import NumberInputField from '../fields/NumberInputField';
import PickerSelectField from '../fields/PickerSelectField';

interface Props {
  item?: ListItem;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: (data: ListItemInput) => void;
}

const ItemFormModal: React.FC<Props> = ({ item, open, setOpen, onSubmit }) => {
  const { t } = useTranslation('common');

  const unitsList = useMemo(
    () =>
      t('units_list', { returnObjects: true }) as {
        label: string;
        value: string;
      }[],
    [t]
  );

  const { list, updateItem, addItem } = useUserListStore();
  const isEdit = !!item;
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
          <CardTitle>
            {t(isEdit ? 'title_edit' : 'title_create', {
              keyPrefix: 'item_form'
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View className="" style={{ rowGap: 24 }}>
            <InputField
              name="name"
              label={t('fields.name.label', { keyPrefix: 'item_form' })}
              control={control}
              placeholder={t('fields.name.placeholder', {
                keyPrefix: 'item_form'
              })}
            />
            <NumberInputField
              name="quantity"
              clearTextOnFocus
              label={t('fields.quantity.label', { keyPrefix: 'item_form' })}
              control={control}
              placeholder={t('fields.quantity.placeholder', {
                keyPrefix: 'item_form'
              })}
              keyboardType="number-pad"
            />

            <PickerSelectField
              control={control}
              name="unit"
              label={t('fields.unit.label', { keyPrefix: 'item_form' })}
              items={unitsList}
              placeholder={{
                label: t('fields.unit.placeholder', { keyPrefix: 'item_form' })
              }}
            />
            <InputField
              name="note"
              label={t('fields.note.label', { keyPrefix: 'item_form' })}
              control={control}
              placeholder={t('fields.note.placeholder', {
                keyPrefix: 'item_form'
              })}
              multiline
              numberOfLines={3}
            />

            <View className="gap-y-4">
              <AppButton
                onPress={handleSubmit(handleOnSubmit)}
                //disabled={isSubmitting || !isValid}
              >
                {t('submit_button', { keyPrefix: 'item_form' })}
              </AppButton>
              <AppButton
                variant="outline"
                onPress={handleClose}
                disabled={isSubmitting}
              >
                {t(isDirty ? 'cancel_button' : 'close_button', {
                  keyPrefix: 'item_form'
                })}
              </AppButton>
            </View>
          </View>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ItemFormModal;
