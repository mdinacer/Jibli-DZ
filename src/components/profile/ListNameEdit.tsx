import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import InputField from '@/components/fields/InputField';
import { Button } from '@/components/Themed/Button';
import ListsService from '@/services/ListService';
import { useListStore } from '@/stores/useListStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

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

        <Button
          onPress={handleSubmit(handleOnSubmit)}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {t('cta')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ListNameEdit;
