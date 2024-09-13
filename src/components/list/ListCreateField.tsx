import { useProfileStore } from '@/stores/useProfileStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Form, H2, Paragraph, Spinner, XStack } from 'tamagui';
import { z } from 'zod';
import InputField from '@/components/fields/InputField';
import { List, ListCreateInput } from '@/models/List';
import listsService from '@/services/ListService';
import ListsService from '@/services/ListService';

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
    <Card elevate bordered>
      <Card.Header padded>
        <H2>Create List</H2>
        <Paragraph theme="alt2">Create your initial list</Paragraph>
      </Card.Header>

      <Form
        alignItems="center"
        justifyContent="center"
        minWidth={300}
        paddingHorizontal="$4"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <InputField
          name="name"
          label="List name"
          control={control}
          placeholder="Enter list name"
        />

        <Card.Footer padded>
          <XStack flex={1} />
          <Form.Trigger asChild disabled={isLoading || isSubmitting}>
            <Button
              themeInverse
              borderRadius="$10"
              icon={isSubmitting ? () => <Spinner /> : undefined}
              disabled={!isValid || isSubmitting}
            >
              Create
            </Button>
          </Form.Trigger>
        </Card.Footer>
      </Form>
    </Card>
  );
};

export default ListCreateField;
