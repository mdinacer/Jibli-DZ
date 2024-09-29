import Text from '@/components/Themed/Text';
import { ThemeProps } from '@/components/Themed/types';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

interface Props<T extends FieldValues>
  extends Omit<PickerSelectProps, 'value' | 'onValueChange' | 'items'>,
    ThemeProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: { label: string; value: string }[];
}

const PickerSelectField = <T extends FieldValues>({
  label,
  control,
  name,
  items = [],
  lightColor,
  darkColor,
  style,
  ...props
}: Props<T>) => {
  const theme = useThemeColor({
    light: lightColor,
    dark: darkColor
  }) as ThemeType;

  // const { t } = useTranslation('common', { keyPrefix: 'units' });
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <View
            style={{
              backgroundColor: theme.background,
              borderWidth: 1,
              borderColor: theme.input,
              borderRadius: 8,
              overflow: 'hidden'
            }}
          >
            <RNPickerSelect
              {...props}
              value={value}
              onValueChange={onChange}
              items={items}
              textInputProps={{
                placeholderTextColor: theme.mutedForeground
              }}
              pickerProps={{
                dropdownIconColor: theme.foreground,
                style: {
                  color: theme.foreground,
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                  lineHeight: 24
                }
              }}
              style={style}
            />
          </View>
          {error?.message && <Text>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default PickerSelectField;

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 8
  },
  container: { rowGap: 6, width: '100%' },
  inputIOS: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#000'
  },
  inputAndroid: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#000'
  },
  placeholder: {
    color: '#6b7280'
  },
  iconContainer: {
    top: 10,
    right: 12
  },
  viewContainer: {
    marginBottom: 12
  }
});
