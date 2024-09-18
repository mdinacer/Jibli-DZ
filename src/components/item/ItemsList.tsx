import { mockListItems } from '@/data/mock-data';
import React from 'react';
import { FlatList } from 'react-native';
import UserItemDisplay from './UserItemDisplay';

const ItemsList = () => {
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
