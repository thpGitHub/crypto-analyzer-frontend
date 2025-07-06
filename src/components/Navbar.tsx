import React from 'react';
import {
  Box,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <Box
      bg={bgColor}
      px={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Flex h={16} alignItems="center" justifyContent="flex-end">
        <HStack spacing={4}>
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          <Button
            onClick={handleLogout}
            colorScheme="red"
            variant="ghost"
            _hover={{
              bg: 'red.50',
              color: 'red.600'
            }}
          >
            Déconnexion
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar; 