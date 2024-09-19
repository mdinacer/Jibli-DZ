import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Text, TextInputProps, View } from 'react-native';
import AppInput from '../AppInput';

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
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error }
      }) => (
        <View style={{ rowGap: 6 }} className="w-full max-w-sm">
          <Text className="font-pregular text-sm font-medium leading-none">
            {label}
          </Text>
          <AppInput
            {...props}
            {...field}
            value={value}
            onChangeText={onChange}
          />
          {error?.message && (
            <Text className="font-pregular text-base text-destructive">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default InputField;
