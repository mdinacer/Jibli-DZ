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
        className="dark relative w-full rounded-2xl border border-border bg-background px-3 py-1 dark:bg-red-600"
      >
        <TextInput
          ref={ref}
          {...props}
          placeholderTextColor={'#6b7280'}
          className={`w-full px-3 py-2 font-pregular text-base placeholder:text-sm ${props.multiline ? 'min-h-[80px]' : 'h-10'}`}
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
