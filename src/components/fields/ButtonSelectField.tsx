import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Text, TextInputProps, TouchableOpacity, View } from 'react-native';

interface Props<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: { label: string; value: string }[];
}

const ButtonsSelectField = <T extends FieldValues>({
  label,
  control,
  name,
  items = []
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
          <Text className="font-pregular text-base font-medium leading-none">
            {label}
          </Text>
          <View
            className="w-full flex-row flex-wrap justify-evenly"
            style={{ gap: 4 }}
          >
            {items.map((item) => (
              <TouchableOpacity
                className={`rounded-md border border-border px-4 py-2 ${value === item.value && 'bg-background shadow-sm'}`}
                onPress={() => onChange(item.value)}
                key={`${item.value}`}
              >
                <Text
                  className={` ${value === item.value ? 'font-pmedium text-primary' : 'font-pregular text-muted-foreground'}`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {error?.message && <Text>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default ButtonsSelectField;
