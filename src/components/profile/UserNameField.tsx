import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/Card';
import ProfileService from '@/services/ProfileService';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const UserNameField = () => {
  const { t } = useTranslation('common', { keyPrefix: 'username_form' });
  const [isSaving, setIsSaving] = useState(false);
  const { profile, updateProfile } = useProfileStore();
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
      updateProfile({ username });
    } catch (error: any) {
      console.error('An error occurred while updating your username', {
        message: error.message
      });
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }, [profile, updateProfile, username]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <AppInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </CardContent>
      <CardFooter className="flex-row justify-between">
        <AppButton
          variant="secondary"
          onPress={handleReset}
          disabled={!isModified || isSaving}
        >
          {t('cancel_button')}
        </AppButton>
        <View />
        <AppButton
          onPress={handleUpdateUserName}
          disabled={!isModified || isSaving}
        >
          {t('submit_button')}
        </AppButton>
      </CardFooter>
    </Card>
  );
};

export default UserNameField;
