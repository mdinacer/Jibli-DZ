import { List } from '@/models/List';
import { ListItem, StatusOrder } from '@/models/ListItem';

interface ListChanges {
  nameChanged: boolean;
  addedItems: ListItem[];
  updatedItems: ListItem[];
  removedItems: ListItem[];
}

export const generateSlug = (name: string): string => {
  return name
    .replace(/[^\w\s]/gi, '_')
    .toLowerCase()
    .trim();
};

export const duplicateListItemNameCheck = (
  list: List,
  newName: string,
  oldName?: string
) => {
  const lowerNewName = newName.toLowerCase();
  const lowerOldItemName = oldName ? oldName.toLowerCase() : undefined;

  for (const item of list.items) {
    const lowerItemName = item.name.toLowerCase();

    if (lowerItemName === lowerNewName) {
      if (lowerOldItemName && lowerItemName === lowerOldItemName) {
        continue;
      }
      return true;
    }
  }
  return false;
};

// export const hashList = (list: ListItem[]): string => {
//   const hash = createHash('sha256');
//   list
//     .sort((a, b) => a.id.localeCompare(b.id))
//     .forEach((item) => hash.update(hashListItem(item)));
//   return hash.digest('hex');
// };

// const hashListItem = (item: ListItem): string => {
//   const { id, name, status, quantity, unit, note, price } = item;
//   const hash = createHash('sha256');
//   hash.update(id);
//   hash.update(name);
//   hash.update(status);
//   if (price) hash.update(price.toString());
//   if (note) hash.update(note);
//   if (quantity !== undefined) hash.update(quantity.toString());
//   if (unit) hash.update(unit);
//   return hash.digest('hex');
// };

// export const detectListChanges = (
//   originalList: List,
//   modifiedList: List
// ): ListChanges => {
//   const originalItemsMap = new Map(
//     originalList.items.map((item) => [item.id, item])
//   );
//   const modifiedItemsMap = new Map(
//     modifiedList.items.map((item) => [item.id, item])
//   );

//   const addedItems: ListItem[] = [];
//   const updatedItems: ListItem[] = [];
//   const removedItems: ListItem[] = [];

//   const nameChanged = originalList.name !== modifiedList.name;

//   modifiedItemsMap.forEach((modifiedItem, id) => {
//     if (!originalItemsMap.has(id)) {
//       addedItems.push(modifiedItem);
//     } else {
//       const originalItem = originalItemsMap.get(id);
//       if (
//         originalItem &&
//         hashListItem(originalItem) !== hashListItem(modifiedItem)
//       ) {
//         updatedItems.push(modifiedItem);
//       }
//     }
//   });

//   originalItemsMap.forEach((originalItem, id) => {
//     if (!modifiedItemsMap.has(id)) {
//       removedItems.push(originalItem);
//     }
//   });

//   return { nameChanged, addedItems, updatedItems, removedItems };
// };

export function sortItemByStatus(items: ListItem[]): ListItem[] {
  return items.sort((a, b) => {
    const statusDiff =
      StatusOrder.indexOf(a.status) - StatusOrder.indexOf(b.status);
    if (statusDiff !== 0) return statusDiff;
    return a.name.localeCompare(b.name); // Assuming 'name' is the property for alphabetical sorting
  });
}

export const compareItems = (a: ListItem, b: ListItem) => {
  return (
    a.name === b.name &&
    a.unit === b.unit &&
    a.quantity === b.quantity &&
    a.status === b.status &&
    a.note === b.note
  );
};
