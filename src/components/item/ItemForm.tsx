import React, { useCallback, useMemo } from 'react';

import InputField from '@/components/fields/InputField';
import {
  ListItem,
  ListItemInput,
  ListItemInputSchema
} from '@/models/ListItem';
import { ProductUnit } from '@/models/ProductUnit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import AppButton from '../AppButton';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card';
import NumberInputField from '../fields/NumberInputField';
import PickerSelectField from '../fields/PickerSelectField';

interface Props {
  item?: ListItem;
  onSubmit: (data: ListItemInput) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<Props> = ({ item, onSubmit, onCancel }) => {
  const { t } = useTranslation('common');

  const unitsList = useMemo(
    () =>
      t('units_list', { returnObjects: true }) as {
        label: string;
        value: string;
      }[],
    [t]
  );
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
      try {
        onSubmit(data);
        reset();
      } catch (error: any) {
        console.error(error);
      }
    },
    [onSubmit, reset]
  );

  return (
    <View className="flex-1 py-6">
      <Text className="mb-8 font-pmedium text-lg">
        {t('title_create', { keyPrefix: 'item_form' })}
      </Text>
      <View className="mb-8" style={{ rowGap: 24 }}>
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
      </View>

      <View style={{ rowGap: 16 }} className="flex-col">
        <AppButton
          className="w-full"
          onPress={handleSubmit(handleOnSubmit)}
          //disabled={isSubmitting || !isValid}
        >
          {t('submit_button', { keyPrefix: 'item_form' })}
        </AppButton>
        <AppButton
          className="w-full"
          variant="outline"
          onPress={onCancel}
          disabled={isSubmitting}
        >
          {t(isDirty ? 'cancel_button' : 'back_button', {
            keyPrefix: 'item_form'
          })}
        </AppButton>
      </View>
    </View>
  );
};

export default ItemForm;
