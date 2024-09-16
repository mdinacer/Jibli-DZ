import ItemForm from '@/components/item/ItemForm';
import ListCreateField from '@/components/list/ListCreateField';
import { ListItem, ListItemInput, ListItemStatus } from '@/models/ListItem';
import { useUserListStore } from '@/stores/useUserListStore';
import { generateId } from '@/utils/IdGenerator';
import { Timestamp } from '@react-native-firebase/firestore';
import React, { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Create = () => {
  const { list, addItem } = useUserListStore();

  const addNewItem = useCallback(
    (data: ListItemInput) => {
      const item: ListItem = {
        ...data,
        id: generateId(),
        status: ListItemStatus.PENDING,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      addItem(item);
    },
    [addItem]
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <KeyboardAvoidingView>
        <ScrollView>
          <View className="flex-1 justify-center">
            {list ? (
              <ItemForm onSubmit={addNewItem} onCancel={function (): void {}} />
            ) : (
              <ListCreateField
                onComplete={(list) => {
                  console.log(JSON.stringify(list, null, 2));
                }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Create;
