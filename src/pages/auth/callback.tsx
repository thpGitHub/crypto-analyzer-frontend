import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Spinner, Center } from '@chakra-ui/react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token as string;
    if (token) {
      // Stocker le token
      localStorage.setItem('auth_token', token);
      
      // Rediriger vers la page d'accueil
      router.push('/');
    }
  }, [router.query]);

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  );
} 