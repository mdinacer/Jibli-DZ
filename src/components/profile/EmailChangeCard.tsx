import InputField from '@/components/fields/InputField';
import firebaseServices from '@/config/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AppButton from '../AppButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../Card';

const schema = z.object({
  currentPassword: z.string().min(6, '{value} must be at least 6 characters'),
  newEmail: z.string().email('{value} is not a valid email')
});

type SchemaType = z.infer<typeof schema>;
const EmailChangeCard = () => {
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
        <CardTitle>Email</CardTitle>
        <CardDescription>Update your email</CardDescription>
      </CardHeader>

      <CardContent style={{ rowGap: 24 }}>
        <InputField
          id={'email-change-current-password'}
          name="currentPassword"
          label="Current Password"
          control={control}
          placeholder="Type your current password"
          secureTextEntry
        />
        <InputField
          id={'email-change-new-email'}
          name="newEmail"
          label="New Email"
          control={control}
          placeholder="Type your new email"
        />

        <AppButton
          onPress={handleSubmit(handleOnSubmit)}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          update
        </AppButton>
      </CardContent>
    </Card>
  );
};

export default EmailChangeCard;
