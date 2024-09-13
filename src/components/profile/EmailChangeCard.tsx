import firebaseServices from '@/config/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Form, H2, Paragraph, Spinner, XStack } from 'tamagui';
import { z } from 'zod';
import InputField from '../fields/InputField';

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
    formState: { isSubmitting, isDirty, isValid, isLoading },
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
    <Card elevate size="$4" bordered>
      <Card.Header padded>
        <H2>Email</H2>
        <Paragraph theme="alt2">Update your email</Paragraph>
      </Card.Header>

      <Form
        flex={1}
        alignItems="center"
        justifyContent="center"
        minWidth={300}
        gap="$4"
        onSubmit={handleSubmit(handleOnSubmit)}
        borderWidth={1}
        borderRadius="$4"
        backgroundColor="$background"
        borderColor="$borderColor"
        paddingHorizontal="$4"
      >
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

        <Card.Footer padded>
          <XStack flex={1} />
          <Form.Trigger asChild disabled={isLoading || isSubmitting}>
            <Button
              themeInverse
              borderRadius="$10"
              icon={isSubmitting ? () => <Spinner /> : undefined}
              disabled={!isDirty || !isValid || isSubmitting}
            >
              Update
            </Button>
          </Form.Trigger>
        </Card.Footer>
      </Form>
    </Card>
  );
};

export default EmailChangeCard;
