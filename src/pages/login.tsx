import { useEffect } from 'react';
import { Box, Button, Container, Heading, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3006';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3005';

export default function Login() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  const handleGithubLogin = () => {
    const callbackUrl = `${FRONTEND_URL}/auth/callback`;
    window.location.href = `${AUTH_URL}/auth/github?callback_url=${encodeURIComponent(callbackUrl)}`;
  };

  if (isLoading || user) {
    return <div>Chargement...</div>;
  }

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Connexion</Heading>
        <Box>
          <Button
            onClick={handleGithubLogin}
            colorScheme="gray"
            size="lg"
          >
            Se connecter avec GitHub
          </Button>
        </Box>
      </VStack>
    </Container>
  );
} 