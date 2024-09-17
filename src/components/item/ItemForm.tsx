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
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import AppButton from '../AppButton';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card';
import ButtonsSelectField from '../fields/ButtonSelectField';
import NumberInputField from '../fields/NumberInputField';

interface Props {
  item?: ListItem;
  onSubmit: (data: ListItemInput) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<Props> = ({ item, onSubmit, onCancel }) => {
  const { t } = useTranslation('common', { keyPrefix: 'item_form' });
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
        <CardTitle>{t('title_create')}</CardTitle>
        <CardDescription>{t('description_create')}</CardDescription>
      </CardHeader>
      <CardContent style={{ rowGap: 24 }}>
        <InputField
          name="name"
          label={t('fields.name.label')}
          control={control}
          placeholder={t('fields.name.placeholder')}
        />
        <NumberInputField
          name="quantity"
          clearTextOnFocus
          label={t('fields.quantity.label')}
          control={control}
          placeholder={t('fields.quantity.placeholder')}
          keyboardType="number-pad"
        />

        <ButtonsSelectField
          control={control}
          name="unit"
          label={t('fields.unit.label')}
          items={ProductUnitsList}
        />
        <InputField
          name="note"
          label={t('fields.note.label')}
          control={control}
          placeholder={t('fields.note.placeholder')}
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
          {t('submit_button')}
        </AppButton>
        <AppButton
          className="w-full"
          variant="outline"
          onPress={onCancel}
          disabled={isSubmitting}
        >
          {t(isDirty ? 'cancel_button' : 'back_button')}
        </AppButton>
      </CardFooter>
    </View>
  );
};

export default ItemForm;
