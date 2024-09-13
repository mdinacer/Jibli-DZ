import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import React, { useMemo } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { LinearGradient } from 'tamagui/linear-gradient';

import {
  Adapt,
  Label,
  Select,
  SelectProps,
  Sheet,
  SizableText,
  YStack
} from 'tamagui';

interface Props<T extends FieldValues> extends SelectProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  data: {
    label: string;
    value: string;
  }[];
}

const SelectField = <T extends FieldValues>({
  label,
  control,
  name,
  placeholder,
  data = [],
  ...props
}: Props<T>) => {
  const itemsDisplay = useMemo(
    () =>
      data.map(({ label, value }, i) => {
        return (
          <Select.Item index={i} key={value} value={value}>
            <Select.ItemText>{label}</Select.ItemText>
            <Select.ItemIndicator marginLeft="auto">
              <Check size={16} />
            </Select.ItemIndicator>
          </Select.Item>
        );
      }),
    [data]
  );
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
          <Select
            value={value}
            onValueChange={onChange}
            disablePreventBodyScroll
            {...props}
          >
            <Select.Trigger width={220} iconAfter={ChevronDown}>
              <Select.Value placeholder={placeholder} />
            </Select.Trigger>

            <Adapt when="sm" platform="touch">
              <Sheet
                native={!!props.native}
                modal
                dismissOnSnapToBottom
                animationConfig={{
                  type: 'spring',
                  damping: 20,
                  mass: 1.2,
                  stiffness: 250
                }}
              >
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay
                  animation="lazy"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
              <Select.ScrollUpButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <YStack zIndex={10}>
                  <ChevronUp size={20} />
                </YStack>
                <LinearGradient
                  start={[0, 0]}
                  end={[0, 1]}
                  fullscreen
                  colors={['$background', 'transparent']}
                  borderRadius="$4"
                />
              </Select.ScrollUpButton>

              <Select.Viewport
                // to do animations:
                // animation="quick"
                // animateOnly={['transform', 'opacity']}
                // enterStyle={{ o: 0, y: -10 }}
                // exitStyle={{ o: 0, y: 10 }}
                minWidth={200}
              >
                <Select.Group>
                  <Select.Label>{name}</Select.Label>

                  {itemsDisplay}
                </Select.Group>
              </Select.Viewport>

              <Select.ScrollDownButton
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                height="$3"
              >
                <YStack zIndex={10}>
                  <ChevronDown size={20} />
                </YStack>
                <LinearGradient
                  start={[0, 0]}
                  end={[0, 1]}
                  fullscreen
                  colors={['transparent', '$background']}
                  borderRadius="$4"
                />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select>
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

export default SelectField;
