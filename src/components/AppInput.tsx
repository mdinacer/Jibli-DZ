import { Icons } from '@/constants';
import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';

const AppInput: React.FC<TextInputProps> = ({ secureTextEntry, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View
      style={{ position: 'relative' }}
      className="relative w-full rounded-md border border-border px-3 py-1"
    >
      <TextInput
        {...props}
        placeholderTextColor={'#6b7280'}
        className="h-10 w-full px-3 py-2 font-pregular text-base"
        secureTextEntry={secureTextEntry && !isVisible}
      />
      {secureTextEntry && (
        <View className="absolute right-3 top-3">
          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            {isVisible ? (
              <Icons.EyeClosedIcon color={'black'} width={20} height={20} />
            ) : (
              <Icons.EyeOpenIcon color={'black'} width={20} height={20} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AppInput;
