import CollaboratorsList from '@/components/collaborator/CollaboratorsList';
import InvitationModal from '@/components/invitation/InvitationModal';
import InvitationsList from '@/components/invitation/InvitationsList';
import { Button } from '@/components/Themed/Button';
import SafeAreaView from '@/components/Themed/SafeAreaView';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Collaborators = () => {
  const [open, setOpen] = useState(false);
  const theme = useThemeColor({}) as ThemeType;
  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <InvitationsList
        ListHeaderComponent={
          <View>
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.mutedForeground }
                  ]}
                >
                  Collaborators
                </Text>
              </View>
              <Button size="sm" onPress={() => setOpen(true)} variant="default">
                Invite
              </Button>
            </View>
            <CollaboratorsList />
            <View style={styles.sectionTitle}>
              <Text
                style={[styles.sectionTitle, { color: theme.mutedForeground }]}
              >
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

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  titleContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 20
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 6,
    letterSpacing: -0.4
  }
});
