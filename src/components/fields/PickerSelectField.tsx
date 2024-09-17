import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

interface Props<T extends FieldValues>
  extends Omit<PickerSelectProps, 'value' | 'onValueChange' | 'items'> {
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
  ...props
}: Props<T>) => {
  const { t } = useTranslation('common', { keyPrefix: 'units' });
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ rowGap: 6 }} className="w-full max-w-sm">
          <Text className="font-pregular text-base font-medium leading-none">
            {label}
          </Text>
          <RNPickerSelect
            {...props}
            value={value}
            onValueChange={onChange}
            items={items}
            dropdownItemStyle={{ backgroundColor: '#fff' }}
            style={styles}
          />
          {error?.message && <Text>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default PickerSelectField;

const styles = StyleSheet.create({
  inputIOS: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    backgroundColor: '#fff',
    color: '#000'
  },
  inputAndroid: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
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
