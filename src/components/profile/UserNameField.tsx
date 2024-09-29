import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/Card';
import { Button } from '@/components/Themed/Button';
import TextInput from '@/components/Themed/TextInput';
import ProfileService from '@/services/ProfileService';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

const UserNameField = () => {
  const { t } = useTranslation('common', { keyPrefix: 'username_form' });
  const [isSaving, setIsSaving] = useState(false);
  const { profile } = useProfileStore();
  const [username, setUsername] = useState<string | undefined>(
    profile?.username
  );

  const isModified = useMemo(
    () => profile?.username !== username,
    [profile?.username, username]
  );

  const handleReset = useCallback(() => {
    setUsername(profile?.username);
  }, [profile?.username]);

  const handleUpdateUserName = useCallback(async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const updatedProfile = await ProfileService.update(profile.id, {
        username
      });
      if (!updatedProfile) {
        console.error('An error occurred while updating your username');
      }
    } catch (error: any) {
      console.error('An error occurred while updating your username', {
        message: error.message
      });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [profile, username]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </CardContent>
      <CardFooter style={styles.footer}>
        <Button
          variant="secondary"
          onPress={handleReset}
          disabled={!isModified || isSaving}
        >
          {t('cancel_button')}
        </Button>
        <View />
        <Button
          onPress={handleUpdateUserName}
          disabled={!isModified || isSaving}
        >
          {t('submit_button')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserNameField;

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', justifyContent: 'space-between' }
});
