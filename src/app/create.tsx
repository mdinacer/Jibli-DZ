import { View, Text, Platform } from 'react-native';
import React, { useCallback } from 'react';
import { useUserListStore } from '@/stores/useUserListStore';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileStore } from '@/stores/useProfileStore';
import { useListStore } from '@/stores/useListStore';
import { ListCreateInput } from '@/models/List';
import ListsService from '@/services/ListService';
import InputField from '@/components/fields/InputField';
import AppButton from '@/components/AppButton';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const formSchema = z.object({
  name: z.string().min(1, 'Required')
});

type FormDataType = z.infer<typeof formSchema>;

const Create = () => {
  const { t } = useTranslation('common', { keyPrefix: 'list_create' });
  const { profile } = useProfileStore();

  const { list, setList } = useUserListStore();
  const { addList } = useListStore();

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile ? `${capitalize(profile.username)}'s list` : ''
    }
  });

  const {
    formState: { isSubmitting, isValid, isDirty },
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
          //onComplete(createdList);
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
    [addList, setList]
  );

  if (!profile || list) {
    return <Redirect href={'/home'} />;
  }
  return (
    <SafeAreaView
      className="flex-1"
      edges={
        Platform.OS === 'android'
          ? ['top', 'left', 'right', 'bottom']
          : ['bottom']
      }
    >
      <View className="flex-1 justify-center p-6" style={{ rowGap: 24 }}>
        <Text className="font-pbold text-2xl">{t('title')}</Text>
        <View>
          <InputField
            name="name"
            label={t('fields.name.label')}
            control={control}
            placeholder={t('fields.name.placeholder')}
          />
        </View>
        <View style={{ rowGap: 12 }}>
          <AppButton
            className="w-full"
            onPress={handleSubmit(handleOnSubmit)}
            disabled={!isValid || isSubmitting}
          >
            {t('cta')}
          </AppButton>
          <AppButton
            variant="outline"
            className="w-full"
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            {t(isDirty ? 'cancel' : 'back')}
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Create;
