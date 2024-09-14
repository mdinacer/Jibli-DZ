import { Collaborator } from '@/models/Collaborator';
import { ListItem, ListItemStatus } from '@/models/ListItem';
import { Product } from '@/models/Product';
import { ProductUnit } from '@/models/ProductUnit';
import { Timestamp } from 'firebase/firestore';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Apples',
    description: 'Fresh and crispy apples.',
    price: 2.99,
    unit: ProductUnit.KG,
    image: {
      fileName: 'apples.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Fruits',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '2',
    name: 'Bananas',
    description: 'Ripe and sweet bananas.',
    price: 1.29,
    unit: ProductUnit.KG,
    image: {
      fileName: 'bananas.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Fruits',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '3',
    name: 'Carrots',
    description: 'Crunchy organic carrots.',
    price: 1.49,
    unit: ProductUnit.KG,
    image: {
      fileName: 'carrots.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Vegetables',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '4',
    name: 'Potatoes',
    description: 'High-quality potatoes for all purposes.',
    price: 0.99,
    unit: ProductUnit.KG,
    image: {
      fileName: 'potatoes.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Vegetables',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '5',
    name: 'Tomatoes',
    description: 'Juicy and fresh tomatoes.',
    price: 2.49,
    unit: ProductUnit.KG,
    image: {
      fileName: 'tomatoes.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Vegetables',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '6',
    name: 'Oranges',
    description: 'Vitamin-rich sweet oranges.',
    price: 3.49,
    unit: ProductUnit.KG,
    image: {
      fileName: 'oranges.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Fruits',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '7',
    name: 'Broccoli',
    description: 'Fresh green broccoli.',
    price: 2.99,
    unit: ProductUnit.PIECE,
    image: {
      fileName: 'broccoli.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Vegetables',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '8',
    name: 'Milk',
    description: 'Fresh dairy milk.',
    price: 1.99,
    unit: ProductUnit.BOTTLE,
    image: {
      fileName: 'milk.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Dairy',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '9',
    name: 'Eggs',
    description: 'Farm-fresh eggs.',
    price: 3.59,
    unit: ProductUnit.PACK,
    image: {
      fileName: 'eggs.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Dairy',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '10',
    name: 'Cheese',
    description: 'Delicious cheddar cheese.',
    price: 4.99,
    unit: ProductUnit.KG,
    image: {
      fileName: 'cheese.jpg',
      fileUrl: 'https://picsum.photos/200'
    },
    category: 'Dairy',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export const mockListItems: ListItem[] = [
  {
    id: 'li1',
    name: 'Apples',
    quantity: 2,
    unit: ProductUnit.KG,
    status: ListItemStatus.PENDING,
    note: 'Bought from the local market.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li2',
    name: 'Bananas',
    quantity: 6,
    unit: ProductUnit.KG,
    status: ListItemStatus.BOUGHT,
    note: 'Use for smoothies.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li3',
    name: 'Carrots',
    quantity: 1,
    unit: ProductUnit.KG,
    status: ListItemStatus.PENDING,
    note: 'Small carrots for the garden.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li4',
    name: 'Potatoes',
    quantity: 5,
    unit: ProductUnit.KG,
    status: ListItemStatus.PENDING,
    note: 'For dinner recipes.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li5',
    name: 'Tomatoes',
    quantity: 3,
    unit: ProductUnit.KG,
    status: ListItemStatus.BOUGHT,
    note: 'For salads.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li6',
    name: 'Oranges',
    quantity: 4,
    unit: ProductUnit.KG,
    status: ListItemStatus.PENDING,
    note: 'Vitamin boost for the week.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li7',
    name: 'Broccoli',
    quantity: 2,
    unit: ProductUnit.PIECE,
    status: ListItemStatus.PENDING,
    note: 'Add to stir-fry.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li8',
    name: 'Milk',
    quantity: 1,
    unit: ProductUnit.BOTTLE,
    status: ListItemStatus.BOUGHT,
    note: 'For breakfast.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li9',
    name: 'Eggs',
    quantity: 12,
    unit: ProductUnit.PACK,
    status: ListItemStatus.PENDING,
    note: 'For baking.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'li10',
    name: 'Cheese',
    quantity: 1,
    unit: ProductUnit.KG,
    status: ListItemStatus.PENDING,
    note: 'For sandwiches.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export const MockCollaborators: Collaborator[] = [
  {
    userId: 'user_1',
    username: 'John Doe',
    picture: 'https://randomuser.me/api/portraits/men/5.jpg',
    email: 'john.doe@example.com'
  },
  {
    userId: 'user_2',
    username: 'Jane Smith',
    picture: 'https://randomuser.me/api/portraits/women/2.jpg',
    email: 'jane.smith@example.com'
  },
  {
    userId: 'user_3',
    username: 'Sam Wilson',
    picture: 'https://randomuser.me/api/portraits/men/3.jpg',
    email: 'sam.wilson@example.com'
  },
  {
    userId: 'user_4',
    username: 'Emily Jones',
    email: 'emily.jones@example.com',
    picture: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    userId: 'user_5',
    username: 'Michael Brown',
    picture: 'https://randomuser.me/api/portraits/men/4.jpg',
    email: 'michael.brown@example.com'
  }
];
