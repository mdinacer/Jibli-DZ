import React, { useCallback, useMemo, useState } from 'react';
import { useProfileStore } from '@/stores/useProfileStore';
import { Button, Card, H2, Input, Paragraph, Stack, XStack } from 'tamagui';
import ProfileService from '@/services/ProfileService';
import { useToastController } from '@tamagui/toast';

const UserNameField = () => {
  const toast = useToastController();
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
        toast.show('An error occurred while updating your username');
      }
      updateProfile({ username });
    } catch (error: any) {
      toast.show('An error occurred while updating your username', {
        message: error.message
      });
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }, [profile, toast, updateProfile, username]);

  return (
    <Card elevate size="$4" bordered>
      <Card.Header padded>
        <H2>Username</H2>
        <Paragraph theme="alt2">Edit your username</Paragraph>
      </Card.Header>
      <Stack paddingHorizontal="$4">
        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </Stack>
      <Card.Footer padded>
        <Button
          onPress={handleReset}
          disabled={!isModified || isSaving}
          borderRadius="$10"
        >
          Reset
        </Button>
        <XStack flex={1} />
        <Button
          onPress={handleUpdateUserName}
          disabled={!isModified || isSaving}
          themeInverse
          borderRadius="$10"
        >
          Save
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default UserNameField;
