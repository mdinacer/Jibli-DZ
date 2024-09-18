import InputField from '@/components/fields/InputField';
import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { z } from 'zod';
import AppButton from '../AppButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card';

const schema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters')
});

type SchemaType = z.infer<typeof schema>;
const AccountDelete = () => {
  const { t } = useTranslation('common', { keyPrefix: 'account_delete_form' });
  const [isDeleted, setIsDeleted] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: ''
    }
  });

  const {
    control,
    formState: { isSubmitting, isDirty, isValid },
    handleSubmit
  } = form;

  const handleDeleteAccount = useCallback(async (password: string) => {
    const user = auth().currentUser;
    if (!user) throw new Error('User not found');
    try {
      const credential = auth.EmailAuthProvider.credential(
        user.email!,
        password
      );

      // Reauthenticate the user before deleting
      await user.reauthenticateWithCredential(credential);

      // Delete the user account
      await user.delete();
      setIsDeleted(true);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  }, []);

  const handleOnSubmit = useCallback(
    async (data: SchemaType) => {
      Alert.alert(t('title'), t('prompt'), [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => handleDeleteAccount(data.currentPassword)
        }
      ]);
    },
    [handleDeleteAccount, t]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <InputField
          name="currentPassword"
          label={t('fields.current_password.label')}
          control={control}
          placeholder={t('fields.current_password.placeholder')}
          secureTextEntry
        />
      </CardContent>
      <CardFooter>
        <AppButton
          variant="destructive"
          className="w-full"
          onPress={handleSubmit(handleOnSubmit)}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {t('submit_button')}
        </AppButton>
      </CardFooter>
    </Card>
  );
};

export default AccountDelete;
