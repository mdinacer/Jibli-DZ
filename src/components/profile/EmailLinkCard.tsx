import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Form, H2, Paragraph, Spinner, XStack } from 'tamagui';
import { z } from 'zod';
import InputField from '../fields/InputField';

const schema = z.object({
  newEmail: z.string().email('{value} is not a valid email'),
  newPassword: z.string().min(6, '{value} must be at least 6 characters')
});

type SchemaType = z.infer<typeof schema>;
const EmailLinkCard = () => {
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      newEmail: ''
    }
  });

  const {
    control,
    formState: { isSubmitting, isDirty, isValid, isLoading },
    handleSubmit
  } = form;

  const reauthenticateUser = useCallback(async () => {
    try {
      // Initiate the Google sign-in process
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (!userInfo.data) return;
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.data.idToken
      );

      // Reauthenticate the user with the Google credential
      const result =
        await auth().currentUser?.reauthenticateWithCredential(
          googleCredential
        );
    } catch (error: any) {
      throw new Error('Re-authentication failed: ' + error.message);
    }
  }, []);

  const linkEmailPassword = useCallback(
    async (email: string, password: string) => {
      const credential = auth.EmailAuthProvider.credential(email, password);
      try {
        const userCredential =
          await auth().currentUser?.linkWithCredential(credential);
        console.log('Account linked successfully', userCredential);
        // Display success message (use your preferred toast implementation)
        // Example: toast.success('Email and password linked successfully!');
      } catch (error: any) {
        throw new Error('Error linking email/password: ' + error.message);
      }
    },
    []
  );

  const handleOnSubmit = useCallback(
    async (data: SchemaType) => {
      try {
        const { newEmail, newPassword } = data;
        await reauthenticateUser();
        await linkEmailPassword(newEmail, newPassword);
      } catch (error: any) {
        console.error(error.message);
      }
    },
    [linkEmailPassword, reauthenticateUser]
  );

  return (
    <Card elevate size="$4" bordered>
      <Card.Header padded>
        <H2>Email</H2>
        <Paragraph theme="alt2">Link a new email to your account</Paragraph>
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
          id={'email-link-new-email'}
          name="newEmail"
          label="New Email"
          control={control}
          placeholder="Type your new email"
        />
        <InputField
          id={'email-link-new-password'}
          name="newPassword"
          label="New Password"
          control={control}
          placeholder="Type your new password"
          secureTextEntry
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
              Link
            </Button>
          </Form.Trigger>
        </Card.Footer>
      </Form>
    </Card>
  );
};

export default EmailLinkCard;
