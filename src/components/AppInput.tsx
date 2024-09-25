import { Icons } from '@/constants';
import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';

const AppInput = React.forwardRef<TextInput, TextInputProps>(
  ({ secureTextEntry, className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <View
        style={{ position: 'relative' }}
        className="relative w-full rounded-md border border-input bg-background"
      >
        <TextInput
          ref={ref}
          {...props}
          placeholderTextColor={'#6b7280'}
          className={`w-full px-3 py-2 text-sm text-foreground ${className} ${props.multiline ? 'min-h-[100px]' : 'h-10'}`}
          secureTextEntry={secureTextEntry && !isVisible}
        />
        {secureTextEntry && props.value && (
          <View className="absolute right-3 top-3">
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
              {isVisible ? (
                <Icons.EyeClosedIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Icons.EyeOpenIcon className="h-5 w-5 text-muted-foreground" />
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
