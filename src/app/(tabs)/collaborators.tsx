import CollaboratorsList from '@/components/collaborator/CollaboratorsList';
import IconButton from '@/components/IconButton';
import InvitationModal from '@/components/invitation/InvitationModal';
import InvitationsList from '@/components/invitation/InvitationsList';
import { Icons } from '@/constants';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Collaborators = () => {
  const [open, setOpen] = useState(false);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
      <InvitationsList
        ListHeaderComponent={
          <View>
            <View className="w-full flex-row items-center p-4">
              <View className="w-full flex-1 pt-5">
                <Text className="font-psemibold text-xl text-muted-foreground">
                  Collaborators
                </Text>
              </View>
              <IconButton
                size="sm"
                icon={Icons.AddCircleIcon}
                onPress={() => setOpen(true)}
              />
            </View>
            <CollaboratorsList />
            <View className="w-full flex-1 pt-5">
              <Text className="font-psemibold text-xl text-muted-foreground">
                Invitations
              </Text>
            </View>
          </View>
        }
      />
      <InvitationModal open={open} setOpen={setOpen} />
    </SafeAreaView>
  );
};

export default Collaborators;
