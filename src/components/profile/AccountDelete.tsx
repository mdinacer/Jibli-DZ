import InputField from '@/components/fields/InputField';
import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Button, Text, View } from 'react-native';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card';
import AppButton from '../AppButton';

const schema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters')
});

type SchemaType = z.infer<typeof schema>;
const AccountDelete = () => {
  const [isDeleted, setIsDeleted] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: ''
    }
  });

  const {
    control,
    formState: { isSubmitting, isDirty, isValid, isLoading },
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
      Alert.alert(
        'Are you sure?',
        'Are you sure you want to delete your account?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => handleDeleteAccount(data.currentPassword)
          }
        ]
      );
    },
    [handleDeleteAccount]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Enter your password to confirm account deletion.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <InputField
          id={'account-delete-current-password'}
          name="currentPassword"
          label="Current Password"
          control={control}
          placeholder="Type your current password"
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
          Delete
        </AppButton>
      </CardFooter>
    </Card>
  );
};

export default AccountDelete;
