import firebaseServices from '@/config/firebaseConfig';
import React, { useCallback, useEffect, useState } from 'react';
import EmailChangeCard from './EmailChangeCard';
import EmailLinkCard from './EmailLinkCard';

const UserEmailEdit = () => {
  const [authProvider, setAuthProvider] = useState<string | undefined>(
    undefined
  );

  const getUserProvider = useCallback(() => {
    const provider =
      firebaseServices.auth.currentUser?.providerData?.[0]?.providerId;
    setAuthProvider(provider);
  }, []);

  useEffect(() => {
    getUserProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>{authProvider === 'password' ? <EmailChangeCard /> : <EmailLinkCard />}</>
  );
};

export default UserEmailEdit;
