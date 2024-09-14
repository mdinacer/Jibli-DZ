import { mockListItems } from '@/data/mock-data';
import { ListItem } from '@/models/ListItem';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import CollaboratorItemDisplay from '@/components/item/CollaboratorItemDisplay';
import ItemForm from '@/components/item/ItemForm';
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
          // <CollaboratorItemDisplay
          //   item={item}
          //   onStatusChange={(status) => {}}
          // />
          <UserItemDisplay item={item} onEdit={() => {}} onDelete={() => {}} />
        )}
      />
      {/* <ItemForm
        item={selectedItem}
        key={selectedItem?.id}
        open={open}
        setOpen={setOpen}
        onSubmit={(data) => {}}
      /> */}
    </>
  );
};

export default ItemsList;
