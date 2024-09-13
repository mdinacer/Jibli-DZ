import { mockListItems } from '@/data/mock-data';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import UserItemDisplay from './UserItemDisplay';
import { ListItem } from '@/models/ListItem';
import ItemForm from './ItemForm';
import CollaboratorItemDisplay from './CollaboratorItemDisplay';

const ItemsList = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListItem | undefined>(
    undefined
  );
  return (
    <>
      <FlatList
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ flexGrow: 1, gap: 10 }}
        keyExtractor={(item) => item.id}
        data={mockListItems}
        renderItem={({ item }) => (
          <CollaboratorItemDisplay
            item={item}
            onStatusChange={(status) => {}}
          />
        )}
      />
      <ItemForm
        item={selectedItem}
        key={selectedItem?.id}
        open={open}
        setOpen={setOpen}
        onSubmit={(data) => {}}
      />
    </>
  );
};

export default ItemsList;
