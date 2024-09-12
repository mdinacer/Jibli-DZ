import { Icons } from '@/constants';
import React, { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Button,
  Input,
  Label,
  SizableText,
  Square,
  View,
  YStack
} from 'tamagui';

type InputProps = React.ComponentProps<typeof Input>;

interface Props<T extends FieldValues> extends InputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

const InputField = <T extends FieldValues>({
  label,
  control,
  name,
  secureTextEntry,
  ...props
}: Props<T>) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error }
      }) => (
        <YStack width={'100%'} gap="$2">
          <Label htmlFor={props.id}>{label}</Label>
          <View style={{ position: 'relative' }}>
            <Input
              {...props}
              {...field}
              value={value}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry && !isVisible}
            />
            {secureTextEntry && (
              <Square
                width={32}
                height={'100%'}
                borderRadius={'full'}
                position="absolute"
                bottom={0}
                top={0}
                right={'$2'}
              >
                <Button unstyled onPress={() => setIsVisible(!isVisible)}>
                  {isVisible ? (
                    <Icons.EyeClosedIcon
                      color={'black'}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Icons.EyeOpenIcon color={'black'} width={20} height={20} />
                  )}
                </Button>
              </Square>
            )}
          </View>
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

export default InputField;
