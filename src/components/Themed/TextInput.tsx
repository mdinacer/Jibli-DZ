import React, { forwardRef } from 'react';
import {
  View,
  TextInputProps,
  TextInput as ExpoTextInput,
  StyleSheet
} from 'react-native';
import { ThemeProps } from './types';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import Text from '@/components/Themed/Text';

interface Props extends TextInputProps, ThemeProps {
  label?: string;
}

const TextInput = forwardRef<ExpoTextInput, Props>(
  ({ style, lightColor, darkColor, label, ...otherProps }, ref) => {
    const theme = useThemeColor({
      light: lightColor,
      dark: darkColor
    }) as ThemeType;

    return (
      <View>
        {label && (
          <Text
            style={[styles.label, { opacity: otherProps.readOnly ? 0.5 : 1 }]}
          >
            {label}
          </Text>
        )}
        <ExpoTextInput
          ref={ref}
          {...otherProps}
          placeholderTextColor={theme.mutedForeground}
          style={[
            styles.input,
            {
              color: theme.foreground,
              borderColor: theme.input,
              backgroundColor: theme.background,
              height: otherProps.multiline ? 80 : 40,
              opacity: otherProps.readOnly ? 0.5 : 1
            },
            style
          ]}
        />
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
    fontSize: 14,
    lineHeight: 20,
    borderRadius: 8,
    fontFamily: 'Poppins-Regular'
  }
});

export default TextInput;
