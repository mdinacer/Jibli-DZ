import AuthProvider from '@/components/AuthProvider';
import DataListeners from '@/components/DataListeners';
import DataLoader from '@/components/DataLoader';
import ListModificationBanner from '@/components/list/ListModificationBanner';
import { Icons } from '@/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface TabIconProps {
  icon: (props: SvgProps) => React.JSX.Element;
  color: string;
  name: string;
  focused: boolean;
}
const TabIcon: React.FC<TabIconProps> = ({
  icon: Icon,
  focused,
  color,
  name
}) => {
  return (
    <View>
      <Icon color={color} className="" height={32} width={32} />
      {/* <Text
        style={{ color }}
        className={` ${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
      >
        {name}
      </Text> */}
    </View>
  );
};

const TabsLayout = () => {
  return (
    <AuthProvider>
      <DataLoader />
      <ListModificationBanner />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#ec4899',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            paddingTop: 0,
            backgroundColor: '#f3f4f6',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            height: 80
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
              />
            )
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabIcon
                icon={Icons.AddCircleIcon}
                color={color}
                focused={focused}
                name={'Create'}
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
              />
            )
          }}
        />
      </Tabs>
      <DataListeners />
    </AuthProvider>
  );
};

export default TabsLayout;
