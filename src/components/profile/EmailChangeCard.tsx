import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/Card';
import InputField from '@/components/fields/InputField';
import { Button } from '@/components/Themed/Button';
import firebaseServices from '@/config/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
  currentPassword: z.string().min(6, '{value} must be at least 6 characters'),
  newEmail: z.string().email('{value} is not a valid email')
});

type SchemaType = z.infer<typeof schema>;
const EmailChangeCard = () => {
  const { t } = useTranslation('common', { keyPrefix: 'email_change_form' });
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newEmail: ''
    }
  });

  const {
    control,
    formState: { isSubmitting, isDirty, isValid },
    handleSubmit,
    reset
  } = form;

  const handleOnSubmit = useCallback(
    async (data: SchemaType) => {
      try {
        const user = firebaseServices.auth.currentUser;
        if (!user) {
          throw new Error('User not found');
        }

        const credential = auth.EmailAuthProvider.credential(
          user.email!,
          data.currentPassword
        );

        await user.reauthenticateWithCredential(credential);
        await user.updateEmail(data.newEmail);
        await user.sendEmailVerification();

        reset();
      } catch (error) {
        console.error('Error updating email:', error);
      }
    },
    [reset]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>

      <CardContent style={{ rowGap: 24 }}>
        <InputField
          id={'email-change-current-password'}
          name="currentPassword"
          label={t('fields.current_password.label')}
          control={control}
          placeholder={t('fields.current_password.placeholder')}
          secureTextEntry
        />
        <InputField
          id={'email-change-new-email'}
          name="newEmail"
          label={t('fields.email.label')}
          control={control}
          placeholder={t('fields.email.placeholder')}
        />

        <Button
          onPress={handleSubmit(handleOnSubmit)}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {t('submit_button')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailChangeCard;
