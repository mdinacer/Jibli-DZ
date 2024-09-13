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
      <Icon color={color} height={32} width={32} />
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
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        //tabBarActiveTintColor: '#FFA001',
        // tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          paddingTop: 0,
          //backgroundColor: '#161622',
          borderTopWidth: 1
          //borderTopColor: '#232533',
          // height: 84
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
  );
};

export default TabsLayout;
