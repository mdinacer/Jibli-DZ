import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Label, SizableText, TextArea, TextAreaProps, YStack } from 'tamagui';

interface Props<T extends FieldValues> extends TextAreaProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

const TextareaField = <T extends FieldValues>({
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
        <YStack width={'100%'} gap="$2">
          <Label>{label}</Label>
          <TextArea
            {...props}
            {...field}
            value={value}
            onChangeText={onChange}
          />
          {error?.message && (
            <SizableText textTransform="capitalize" theme="red_alt1" size="$3">
              {error.message}
            </SizableText>
          )}
        </YStack>
      )}
    />
  );
};

export default TextareaField;
