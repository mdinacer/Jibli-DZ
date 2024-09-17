import { Icons } from '@/constants';
import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';

const AppInput = React.forwardRef<TextInput, TextInputProps>(
  ({ secureTextEntry, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <View
        style={{ position: 'relative' }}
        className="relative w-full rounded-md border border-border bg-background px-3 py-1"
      >
        <TextInput
          ref={ref}
          {...props}
          placeholderTextColor={'#6b7280'}
          className={`w-full px-3 py-2 font-pregular text-base placeholder:text-sm ${props.multiline ? 'min-h-[80px]' : 'min-h-10'}`}
          secureTextEntry={secureTextEntry && !isVisible}
        />
        {secureTextEntry && props.value && (
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
  }
);

AppInput.displayName = 'AppInput';

export default AppInput;
