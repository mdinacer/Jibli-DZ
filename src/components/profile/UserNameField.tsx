import React, { useCallback, useMemo, useState } from 'react';
import { useProfileStore } from '@/stores/useProfileStore';
import ProfileService from '@/services/ProfileService';
import { Button, Text, TextInput, View } from 'react-native';

const UserNameField = () => {
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
    <View>
      <View>
        <Text>Username</Text>
        <Text>Edit your username</Text>
      </View>
      <View>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </View>
      <View>
        <Button
          onPress={handleReset}
          disabled={!isModified || isSaving}
          title="Reset"
        ></Button>
        <View />
        <Button
          onPress={handleUpdateUserName}
          disabled={!isModified || isSaving}
          title="Save"
        ></Button>
      </View>
    </View>
  );
};

export default UserNameField;
