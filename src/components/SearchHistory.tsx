import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Badge,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';

interface SearchHistoryProps {
  searches: Array<{
    crypto: string;
    timestamp: string;
    sentiment: string;
  }>;
  onSelect: (crypto: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ searches, onSelect }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'green';
      case 'negative': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="lg">
      <Heading size="lg" mb={6}>Recherches Récentes</Heading>
      
      {searches.length === 0 ? (
        <Text color="gray.500">Aucune recherche récente</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {searches.map((search, index) => (
            <Flex
              key={`${search.crypto}-${index}`}
              bg={useColorModeValue('gray.50', 'gray.700')}
              p={4}
              borderRadius="lg"
              cursor="pointer"
              justify="space-between"
              align="center"
              onClick={() => onSelect(search.crypto)}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
            >
              <Box>
                <Text fontWeight="semibold" fontSize="lg">{search.crypto}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(search.timestamp).toLocaleString()}
                </Text>
              </Box>
              
              <Badge
                colorScheme={getSentimentColor(search.sentiment)}
                px={3}
                py={1}
                borderRadius="full"
              >
                {search.sentiment}
              </Badge>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default SearchHistory; 