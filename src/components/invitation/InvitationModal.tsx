import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/Card';
import InputField from '@/components/fields/InputField';
import { Button } from '@/components/Themed/Button';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  InvitationFormData,
  InvitationFormSchema,
  InvitationInput
} from '@/models/Invitation';
import collaboratorService from '@/services/collaborator-service';
import invitationService from '@/services/InvitationService';
import { useInvitationStore } from '@/stores/useInvitationStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, StyleSheet } from 'react-native';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const defaultValues = {
  recipient: '',
  message: ''
};

const InvitationModal: React.FC<Props> = ({ open, setOpen }) => {
  const { t } = useTranslation('common', { keyPrefix: 'invitation_form' });
  const { profile } = useProfileStore();
  const { invitations, addInvitation } = useInvitationStore();

  const theme = useThemeColor({}) as ThemeType;

  const receivedInvitations = useMemo(
    () => invitations.map((invitation) => invitation.senderId),
    [invitations]
  );

  const schema = useMemo(
    () =>
      InvitationFormSchema.refine(
        (data) => {
          return profile?.email
            ? data.recipient.toLowerCase() !== profile?.email?.toLowerCase()
            : true;
        },
        {
          message: "You can't invite yourself",
          path: ['recipient']
        }
      ),
    [profile?.email]
  );

  const { control, formState, handleSubmit, setError, reset } =
    useForm<InvitationFormData>({
      resolver: zodResolver(schema),
      defaultValues
    });

  const { isSubmitting, isDirty } = formState;

  const handleFetchRecipient = useCallback(
    async (email: string) => {
      const recipient = await collaboratorService.getCollaboratorByEmail(email);
      if (!recipient) {
        setError('recipient', {
          type: 'manual',
          message: "Recipient doesn't exist"
        });
        return undefined;
      }

      if (profile!.collaborators.some((uid) => uid === recipient.userId)) {
        setError('recipient', {
          type: 'manual',
          message: 'This collaborator is already in your team'
        });
        return undefined;
      }

      if (receivedInvitations.some((uid) => uid === recipient.userId)) {
        setError('recipient', {
          type: 'manual',
          message: 'This collaborator already sent you an invitation'
        });
        return;
      }
      return recipient;
    },
    [profile, receivedInvitations, setError]
  );

  const handleOnSubmit = useCallback(
    async (data: InvitationFormData) => {
      if (!profile) return;
      try {
        const recipient = await handleFetchRecipient(
          data.recipient.toLowerCase()
        );

        if (!recipient) {
          Alert.alert("Recipient doesn't exist");
          return;
        }

        const invitationData: InvitationInput = {
          senderId: profile.uid,
          senderName: profile.username,
          recipientId: recipient.userId,
          message: data.message
        };

        const invitation =
          await invitationService.createInvitation(invitationData);

        if (invitation) {
          addInvitation(invitation);
        }
        reset(defaultValues);
        setOpen(false);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    },
    [addInvitation, handleFetchRecipient, profile, reset, setOpen]
  );

  const handleDiscardChanges = useCallback(() => {
    if (isDirty) {
      reset(defaultValues);
    }
    setOpen(false);
  }, [isDirty, reset, setOpen]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.background
          }
        ]}
      >
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent style={styles.cardContent}>
          <InputField
            name="recipient"
            label={t('fields.email.label')}
            control={control}
            placeholder={t('fields.email.placeholder')}
          />

          <InputField
            control={control}
            name="message"
            label={t('fields.message.label')}
            placeholder={t('fields.message.placeholder')}
            multiline
            numberOfLines={3}
          />
        </CardContent>

        <CardFooter style={styles.cardFooter}>
          <Button
            onPress={handleSubmit(handleOnSubmit)}
            disabled={isSubmitting || !isDirty}
          >
            {t('send')}
          </Button>
          <Button variant="outline" onPress={handleDiscardChanges}>
            {t(isDirty ? 'cancel' : 'close')}
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default InvitationModal;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: '50%',
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  cardContent: {
    rowGap: 24
  },
  cardFooter: {
    rowGap: 16
  }
});
