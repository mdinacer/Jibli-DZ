import AppButton from '@/components/AppButton';
import InputField from '@/components/fields/InputField';
import { List, ListCreateInput } from '@/models/List';
import ListsService from '@/services/ListService';
import { useProfileStore } from '@/stores/useProfileStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { useListStore } from '@/stores/useListStore';
import { router } from 'expo-router';

const formSchema = z.object({
  name: z.string().min(1, 'Required')
});

type FormDataType = z.infer<typeof formSchema>;

interface Props {
  onComplete: (list: List) => void;
}

const ListCreateField: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation('common', { keyPrefix: 'list_create' });
  const { profile } = useProfileStore();
  const { setList } = useUserListStore();
  const { addList } = useListStore();
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile ? `${profile.username}'s list` : ''
    }
  });

  const {
    formState: { isSubmitting, isValid },
    control,
    handleSubmit
  } = form;

  const handleOnSubmit = useCallback(
    async (data: FormDataType) => {
      try {
        const listData: ListCreateInput = {
          name: data.name,
          items: [],
          collaborators: []
        };

        const createdList = await ListsService.create(listData);

        if (createdList) {
          onComplete(createdList);
          setList(createdList);
          addList(createdList);
          router.push({
            pathname: `/list/[id]`,
            params: { id: createdList.id }
          });
        }
      } catch (error: any) {
        console.error(error);
      }
    },
    [addList, onComplete, setList]
  );

  return (
    <Card className="my-auto">
      <CardHeader>
        <Text className="font-pbold text-xl leading-none tracking-tight">
          {t('title')}
        </Text>
      </CardHeader>
      <CardContent>
        <InputField
          name="name"
          label={t('fields.name.label')}
          control={control}
          placeholder={t('fields.name.placeholder')}
        />
      </CardContent>
      <CardFooter>
        <AppButton
          className="w-full"
          onPress={handleSubmit(handleOnSubmit)}
          disabled={!isValid || isSubmitting}
        >
          {t('cta')}
        </AppButton>
      </CardFooter>
    </Card>
  );
};

export default ListCreateField;
