import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/Card';
import IconButton from '@/components/IconButton';
import ItemsList from '@/components/list/ItemsList';
import { Icons } from '@/constants';
import { mockListItems } from '@/data/mock-data';
import { List } from '@/models/List';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { formatDistanceToNow } from 'date-fns';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  list: List;
}

const ListDisplay: React.FC<Props> = ({ list }) => {
  const { collaborators } = useCollaboratorStore();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{list.name}</CardTitle>
        <CardDescription>
          Updated{' '}
          {formatDistanceToNow(list.updatedAt.toDate(), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemsList items={list.items} />
      </CardContent>
      <CardFooter className="border-t border-border bg-muted bg-muted/50 px-6 py-3">
        <View className="flex-1">
          <Text className="font-pregular text-muted-foreground">
            {list.collaborators.length > 0 ? 'Shared' : 'Private'}
          </Text>
        </View>

        <View className="flex-row space-x-4">
          <IconButton
            icon={Icons.PencilEditIcon}
            variant={'secondary'}
            size="sm"
            onPress={() => router.push(`/list/${list.id}`)}
          />
          <IconButton variant={'secondary'} size="sm" icon={Icons.TrashIcon} />
          <IconButton
            variant={'secondary'}
            size="sm"
            disabled={collaborators.length === 0}
            icon={Icons.ShareIcon}
          />
        </View>
      </CardFooter>
    </Card>
  );
};

export default ListDisplay;
