import AuthProvider from '@/components/AuthProvider';
import DataListeners from '@/components/DataListeners';
import DataLoader from '@/components/DataLoader';
import ListModificationBanner from '@/components/list/ListModificationBanner';
import Text from '@/components/Themed/Text';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Tabs } from 'expo-router';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface TabIconProps {
  icon: (props: SvgProps) => JSX.Element;
  color: string;
  name: string;
  focused: boolean;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = memo(
  ({ icon: Icon, color, name, focused, size }) => {
    const { t } = useTranslation('common', { keyPrefix: 'tabs' });

    return (
      <View style={styles.iconContainer}>
        <Icon color={color} height={size} width={size} />
        {focused && (
          <Text
            style={[
              styles.iconText,
              {
                color,
                fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular'
              }
            ]}
          >
            {t(name)}
          </Text>
        )}
      </View>
    );
  }
);

TabIcon.displayName = 'TabIcon';

const TabsLayout: React.FC = () => {
  const theme = useThemeColor({}) as ThemeType;

  return (
    <AuthProvider>
      <DataLoader />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#ec4899',
          tabBarInactiveTintColor: theme.mutedForeground,
          tabBarStyle: {
            ...styles.tabBarStyle,
            backgroundColor: theme.muted,
            borderTopColor: theme.border
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                icon={Icons.HomeIcon}
                color={color}
                focused={focused}
                name="home"
                size={size}
              />
            )
          }}
        />

        <Tabs.Screen
          name="lists"
          options={{
            title: 'Lists',
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                icon={Icons.FilesIcon}
                color={color}
                focused={focused}
                name="lists"
                size={size}
              />
            )
          }}
        />
        <Tabs.Screen
          name="members"
          options={{
            title: 'Members',
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                icon={Icons.ShareKnowledgeIcon}
                color={color}
                focused={focused}
                name="members"
                size={size}
              />
            )
          }}
        />
        <Tabs.Screen
          name="invitations"
          options={{
            title: 'Invitations',
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                icon={Icons.MailOpenIcon}
                color={color}
                focused={focused}
                name="invitations"
                size={size}
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Account',
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                icon={Icons.UserSquareIcon}
                color={color}
                focused={focused}
                name="account"
                size={size}
              />
            )
          }}
        />
      </Tabs>
      <DataListeners />
      <ListModificationBanner />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 4
  },
  iconText: {
    fontSize: 12,
    lineHeight: 14
  },
  tabBarStyle: {
    paddingTop: 0,
    borderTopWidth: 1,
    minHeight: 65
  }
});

export default TabsLayout;
