import InputField from '@/components/fields/InputField';
import { Button } from '@/components/Themed/Button';
import SafeAreaView from '@/components/Themed/SafeAreaView';
import Text from '@/components/Themed/Text';
import { ListCreateInput } from '@/models/List';
import ListsService from '@/services/ListService';
import { useListStore } from '@/stores/useListStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { z } from 'zod';

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
      edges={
        Platform.OS === 'android'
          ? ['top', 'left', 'right', 'bottom']
          : ['bottom']
      }
    >
      <View
        style={{ rowGap: 24, flex: 1, justifyContent: 'center', padding: 24 }}
      >
        <Text
          style={{
            fontFamily: 'Poppins-Bold',
            fontSize: 24,
            lineHeight: 32
          }}
        >
          {t('title')}
        </Text>
        <View>
          <InputField
            name="name"
            label={t('fields.name.label')}
            control={control}
            placeholder={t('fields.name.placeholder')}
          />
        </View>
        <View style={{ rowGap: 12 }}>
          <Button
            onPress={handleSubmit(handleOnSubmit)}
            disabled={!isValid || isSubmitting}
          >
            {t('cta')}
          </Button>
          <Button
            variant="outline"
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            {t(isDirty ? 'cancel' : 'back')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Create;
