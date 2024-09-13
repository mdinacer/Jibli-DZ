import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { Button, Card, Form, H2, Paragraph, Spinner, XStack } from 'tamagui';
import { z } from 'zod';
import InputField from '../fields/InputField';

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
    <Card elevate size="$4" bordered width={'100%'}>
      <Card.Header padded>
        <H2>Delete Account</H2>
        <Paragraph theme="alt2">
          Enter your password to confirm account deletion.
        </Paragraph>
      </Card.Header>

      <Form
        flex={1}
        alignItems="center"
        justifyContent="center"
        minWidth={300}
        gap="$4"
        onSubmit={handleSubmit(handleOnSubmit)}
        paddingHorizontal="$4"
      >
        <InputField
          id={'account-delete-current-password'}
          name="currentPassword"
          label="Current Password"
          control={control}
          placeholder="Type your current password"
          secureTextEntry
        />

        <Card.Footer padded>
          <XStack flex={1} />
          <Form.Trigger asChild disabled={isLoading || isSubmitting}>
            <Button
              backgroundColor="$red10"
              themeInverse
              borderRadius="$10"
              icon={isSubmitting ? () => <Spinner /> : undefined}
              disabled={!isDirty || !isValid || isSubmitting}
            >
              Delete
            </Button>
          </Form.Trigger>
        </Card.Footer>
      </Form>
    </Card>
  );
};

export default AccountDelete;
