import { Link, LinkProps } from 'expo-router';
import React from 'react';

const AppLink: React.FC<LinkProps<string | object>> = ({
  className = 'underline underline-offset-4',

  ...props
}) => (
  <Link
    className={'font-pregular text-base text-primary ' + className}
    {...props}
  />
);

export default AppLink;
