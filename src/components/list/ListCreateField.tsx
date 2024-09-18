import AppButton from '@/components/AppButton';
import InputField from '@/components/fields/InputField';
import { List, ListCreateInput } from '@/models/List';
import ListsService from '@/services/ListService';
import { useProfileStore } from '@/stores/useProfileStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card';

const formSchema = z.object({
  name: z.string().min(1, 'Required')
});

type FormDataType = z.infer<typeof formSchema>;

interface Props {
  onComplete: (list: List) => void;
}

const ListCreateField: React.FC<Props> = ({ onComplete }) => {
  const { profile } = useProfileStore();
  const { setList } = useUserListStore();
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile ? `${profile.username}'s list` : ''
    }
  });

  const {
    formState: { isSubmitting, isValid },
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
          setList(createdList);
        }
        console.log(data);
      } catch (error: any) {
        console.error(error);
      }
    },
    [onComplete, setList]
  );

  return (
    <Card className="my-auto">
      <CardHeader>
        <CardTitle>List creation</CardTitle>
        <CardDescription>Create you initial list</CardDescription>
      </CardHeader>
      <CardContent>
        <InputField
          name="name"
          label="List name"
          control={control}
          placeholder="Enter list name"
        />
      </CardContent>
      <CardFooter>
        <AppButton
          className="w-full"
          onPress={handleSubmit(handleOnSubmit)}
          disabled={!isValid || isSubmitting}
        >
          Create
        </AppButton>
      </CardFooter>
    </Card>
  );
};

export default ListCreateField;
