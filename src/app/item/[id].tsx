import AppButton from '@/components/AppButton';
import InputField from '@/components/fields/InputField';
import NumberInputField from '@/components/fields/NumberInputField';
import PickerSelectField from '@/components/fields/PickerSelectField';
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
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Edit = () => {
  const { t } = useTranslation('common');
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { list, addItem, updateItem } = useUserListStore();

  const item = useMemo(
    () => list?.items.find((i) => i.id === id),
    [id, list?.items]
  );

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

  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/home');
    }
  }, []);

  const handleOnSubmit = useCallback(
    async (data: ListItemInput) => {
      try {
        if (!!item) {
          updateItem(item.id, data);
        } else {
          const itemData: ListItem = {
            ...data,
            id: generateId(),
            status: ListItemStatus.PENDING,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          };
          addItem(itemData);
        }
        reset();
        handleGoBack();
      } catch (error: any) {
        console.error(error);
      }
    },
    [addItem, handleGoBack, item, reset, updateItem]
  );

  const handleCloseModal = useCallback(() => {
    if (isDirty) {
      reset();
    } else {
      handleGoBack();
    }
  }, [handleGoBack, isDirty, reset]);

  if (!list) return <Redirect href="/home" />;
  return (
    <SafeAreaView
      className="flex-1"
      edges={Platform.OS === 'android' ? ['top', 'left', 'right'] : []}
    >
      <View className="flex-1 justify-center p-6" style={{ rowGap: 24 }}>
        <View className="">
          <Text className="font-pmedium text-xl">
            {item
              ? t('title_edit', { keyPrefix: 'item_form', itemName: item.name })
              : t('title_create', { keyPrefix: 'item_form' })}
          </Text>
        </View>

        <View className="" style={{ rowGap: 48 }}>
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

        <View style={{ rowGap: 12 }}>
          <AppButton
            onPress={handleSubmit(handleOnSubmit)}
            disabled={isSubmitting}
          >
            {t('submit_button', { keyPrefix: 'item_form' })}
          </AppButton>
          <AppButton
            disabled={isSubmitting}
            variant="outline"
            onPress={handleCloseModal}
          >
            {t(isDirty ? 'cancel_button' : 'back_button', {
              keyPrefix: 'item_form'
            })}
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Edit;
