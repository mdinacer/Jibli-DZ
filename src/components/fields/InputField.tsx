import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, Text, TextInputProps, View } from 'react-native';
import TextInput from '../Themed/TextInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemeType } from '@/constants/Colors';

interface Props<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

const InputField = <T extends FieldValues>({
  label,
  control,
  name,
  ...props
}: Props<T>) => {
  const theme = useThemeColor({}) as ThemeType;
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error }
      }) => (
        <View style={styles.container}>
          <TextInput
            label={label}
            {...props}
            {...field}
            onChangeText={onChange}
            value={value}
          />
          {error?.message && (
            <Text style={{ color: theme.destructive }}>{error.message}</Text>
          )}
        </View>
      )}
    />
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    rowGap: 6,
    width: '100%'
  }
});
