import AuthProvider from '@/components/AuthProvider';
import DataListeners from '@/components/DataListeners';
import DataLoader from '@/components/DataLoader';
import ListModificationBanner from '@/components/list/ListModificationBanner';
import { Icons } from '@/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface TabIconProps {
  icon: (props: SvgProps) => React.JSX.Element;
  color: string;
  name: string;
  focused: boolean;
  size: number;
}
const TabIcon: React.FC<TabIconProps> = ({
  icon: Icon,
  focused,
  color,
  name,
  size
}) => {
  return (
    <View className="items-center justify-center space-y-1">
      <Icon color={color} height={size} width={size} />
      <Text
        style={{ color }}
        className={` ${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <AuthProvider>
      <DataLoader />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#ec4899',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            paddingTop: 16,
            backgroundColor: '#f3f4f6',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            minHeight: 80
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
                name={'Home'}
                size={size}
              />
            )
          }}
        />

        <Tabs.Screen
          name="collaborators"
          options={{
            title: 'Collaborators',
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                icon={Icons.ShareKnowledgeIcon}
                color={color}
                focused={focused}
                name={'Collaborators'}
                size={size}
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                icon={Icons.UserSquareIcon}
                color={color}
                focused={focused}
                name={'Profile'}
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

export default TabsLayout;
