import { Icons } from '@/constants';
import React, { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';

interface Props<T extends FieldValues> extends TextInputProps {
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
        <View>
          <Text>{label}</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              {...props}
              {...field}
              value={value}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry && !isVisible}
            />
            {secureTextEntry && (
              <View>
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                  {isVisible ? (
                    <Icons.EyeClosedIcon
                      color={'black'}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Icons.EyeOpenIcon color={'black'} width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          {error?.message && <Text>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default InputField;
