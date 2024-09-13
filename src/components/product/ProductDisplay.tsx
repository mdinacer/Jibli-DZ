import { Product } from '@/models/Product';
import { Button, Card, H2, Image, Paragraph, XStack } from 'tamagui';
import React from 'react';
import { Plus } from '@tamagui/lucide-icons';

interface Props {
  product: Product;
  size: number;
}

const ProductDisplay: React.FC<Props> = ({ product, size }) => {
  return (
    <Card elevate width={size} aspectRatio={1} bordered>
      <Card.Header padded>
        <Paragraph theme="alt2">{product.category}</Paragraph>
        <H2>{product.name}</H2>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button borderRadius="$10">
          <Plus />
        </Button>
      </Card.Footer>
      <Card.Background>
        <Image
          objectFit="contain"
          alignSelf="center"
          source={{
            width: size,
            height: size,
            uri: 'https://picsum.photos/200'
          }}
        />
      </Card.Background>
    </Card>
  );
};

export default ProductDisplay;
