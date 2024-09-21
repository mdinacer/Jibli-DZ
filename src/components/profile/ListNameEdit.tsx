import { View, Text } from 'react-native';
import React, { useCallback, useState } from 'react';
import { List } from '@/models/List';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../fields/InputField';
import AppButton from '../AppButton';
import { useTranslation } from 'react-i18next';
import { useUserListStore } from '@/stores/useUserListStore';
import { useListStore } from '@/stores/useListStore';
import ListsService from '@/services/ListService';

interface Props {}

const formSchema = z.object({
  name: z.string().min(1, 'Required')
});

type FormDataType = z.infer<typeof formSchema>;

const ListNameEdit: React.FC<Props> = () => {
  const { list, setList } = useUserListStore();
  const { updateList } = useListStore();
  const { t } = useTranslation('common', { keyPrefix: 'list_name_edit' });
  const {
    control,
    formState: { isSubmitting, isValid, isDirty },
    handleSubmit,
    reset
  } = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: list?.name || ''
    }
  });

  const handleOnSubmit = useCallback(
    async (data: FormDataType) => {
      if (!list) return;
      const { name } = data;
      try {
        await ListsService.update(list.id, { name });
        setList({ ...list, name });
        updateList(list.id, { name });
        console.log();
        reset({ name });
      } catch (error: any) {
        console.error(`Error updating list name: ${error.message}`);
      }
    },
    [list, reset, setList, updateList]
  );

  if (!list) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent style={{ rowGap: 24 }}>
        <InputField
          control={control}
          name="name"
          label={t('fields.name.label')}
          placeholder={t('fields.name.placeholder')}
        />

        <AppButton
          onPress={handleSubmit(handleOnSubmit)}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {t('cta')}
        </AppButton>
      </CardContent>
    </Card>
  );
};

export default ListNameEdit;
