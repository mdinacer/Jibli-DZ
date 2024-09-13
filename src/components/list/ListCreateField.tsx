import InputField from '@/components/fields/InputField';
import { List, ListCreateInput } from '@/models/List';
import ListsService from '@/services/ListService';
import { useProfileStore } from '@/stores/useProfileStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, View } from 'react-native';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Required')
});

type FormDataType = z.infer<typeof formSchema>;

interface Props {
  onComplete: (list: List) => void;
}

const ListCreateField: React.FC<Props> = ({ onComplete }) => {
  const { profile } = useProfileStore();
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile ? `${profile.username}'s list` : ''
    }
  });

  const {
    formState: { isSubmitting, isLoading, isValid, isDirty },
    control,
    handleSubmit
  } = form;

  const handleOnSubmit = useCallback(
    async (data: FormDataType) => {
      try {
        const listData: ListCreateInput = {
          name: data.name,
          items: [],
          collaborators: []
        };

        const createdList = await ListsService.create(listData);

        if (createdList) {
          onComplete(createdList);
        }
        console.log(data);
      } catch (error: any) {
        console.error(error);
      }
    },
    [onComplete]
  );

  return (
    <View>
      <InputField
        name="name"
        label="List name"
        control={control}
        placeholder="Enter list name"
      />

      <Button title="Create" disabled={!isValid || isSubmitting}></Button>
    </View>
  );
};

export default ListCreateField;
