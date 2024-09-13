import { Check as CheckIcon } from '@tamagui/lucide-icons';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Checkbox, Label, XStack } from 'tamagui';

type InputProps = React.ComponentProps<typeof Checkbox>;

interface Props<T extends FieldValues> extends InputProps {
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
        <XStack width={'100%'} alignItems="center" gap="$4">
          <Checkbox
            {...props}
            disabled={disabled}
            checked={value}
            onCheckedChange={onChange}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox>
          <Label htmlFor={props.id}>{label}</Label>
        </XStack>
      )}
    />
  );
};

export default CheckBoxField;
