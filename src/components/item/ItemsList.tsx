import { mockListItems } from '@/data/mock-data';
import { ListItem } from '@/models/ListItem';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import UserItemDisplay from './UserItemDisplay';

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
          <UserItemDisplay item={item} onEdit={() => {}} onDelete={() => {}} />
        )}
      />
    </>
  );
};

export default ItemsList;
