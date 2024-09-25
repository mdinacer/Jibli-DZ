import TextInput from '@/components/Themed/TextInput';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Text, TextInputProps, View } from 'react-native';

interface Props<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  // Additional prop for numeric input
  minValue?: number;
  maxValue?: number;
}

const NumberInputField = <T extends FieldValues>({
  label,
  control,
  name,
  minValue,
  maxValue,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value, ...field },
        fieldState: { error }
      }) => (
        <View style={{ rowGap: 6 }} className="w-full">
          <TextInput
            label={label}
            {...props}
            {...field}
            value={value.toString()}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, ''); // Filter out non-numeric characters
              if (
                minValue !== undefined &&
                parseFloat(numericValue) < minValue
              ) {
                return;
              }
              if (
                maxValue !== undefined &&
                parseFloat(numericValue) > maxValue
              ) {
                return;
              }
              onChange(numericValue);
            }}
            keyboardType="numeric" // Ensure the numeric keyboard is used
          />
          {error?.message && <Text>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default NumberInputField;
