import { Button } from '@/components/Themed/Button';
import Text from '@/components/Themed/Text';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Collaborator } from '@/models/Collaborator';
import { hslToRgb, parseHSL } from '@/utils/hslConverter';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  collaborator: Collaborator;
  onRevoke: (collaborator: Collaborator) => void;
}

const CollaboratorCard: React.FC<Props> = ({ collaborator, onRevoke }) => {
  const { t } = useTranslation('common');
  const theme = useThemeColor({}) as ThemeType;
  const rgbBackground = useMemo(() => {
    const rgbValues = parseHSL(theme.background);

    return rgbValues
      ? hslToRgb(rgbValues[0], rgbValues[1], rgbValues[2])
      : null;
  }, [theme.background]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background
        }
      ]}
    >
      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: theme.background
          }
        ]}
      >
        {collaborator.picture ? (
          <Image
            source={{ uri: collaborator.picture }}
            resizeMode="cover"
            style={styles.image}
          />
        ) : (
          <Icons.UserIcon
            color={theme.mutedForeground}
            style={styles.userIcon}
          />
        )}
        <View
          style={[
            styles.textContainer,
            {
              backgroundColor: rgbBackground
                ? `rgba(${rgbBackground},0.4)`
                : 'rgba(156 163 175 / 0.2)'
            }
          ]}
        >
          <Text style={styles.username}>{collaborator.username}</Text>
          <Text style={styles.email}>{collaborator.email}</Text>
        </View>
      </View>

      <Button
        size="sm"
        style={styles.button}
        variant="destructive"
        onPress={() => onRevoke(collaborator)}
      >
        {t('collaborator_revoke')}
      </Button>
    </View>
  );
};

export default CollaboratorCard;

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'transparent', // Will be set by theme.background
    overflow: 'hidden'
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent' // Will be set by theme.background
  },
  image: {
    width: '100%',
    height: '100%'
  },
  userIcon: {
    height: 112,
    width: 112
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  username: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 28,
    textTransform: 'capitalize'
  },
  email: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20
  },
  button: {
    borderRadius: 0
  }
});
