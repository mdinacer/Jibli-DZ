import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { View } from 'react-native';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

const CheckBoxField = <T extends FieldValues>({
  label,
  control,
  name,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, disabled, ...field } }) => (
        <View>
          {/* <CheckBox
            {...props}
            disabled={disabled}
            checked={value}
            onCheckedChange={onChange}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </CheckBox>
          <Label htmlFor={props.id}>{label}</Label> */}
        </View>
      )}
    />
  );
};

export default CheckBoxField;
