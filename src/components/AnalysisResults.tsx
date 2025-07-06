import React from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Badge,
  useColorModeValue,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  SimpleGrid,
  List,
  ListItem,
  Link,
  Icon,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface Source {
  title: string;
  url: string;
  sentiment: string;
}

interface AnalysisResultsProps {
  crypto: string;
  sentiment: string;
  confidence: number;
  recommendation: string;
  reasons: string[];
  stats: {
    totalNews: number;
    positiveNews: number;
    negativeNews: number;
  };
  sources: Source[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  crypto,
  sentiment,
  confidence,
  recommendation,
  reasons,
  stats,
  sources,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getSentimentColor = (sent: string) => {
    switch (sent.toLowerCase()) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec.toLowerCase()) {
      case 'buy':
        return 'green';
      case 'sell':
        return 'red';
      default:
        return 'yellow';
    }
  };

  return (
    <VStack spacing={6} align="stretch" w="100%">
      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        boxShadow="xl"
      >
        <VStack align="stretch" spacing={4}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <Heading size="lg">{crypto.toUpperCase()}</Heading>
            <Flex gap={2}>
              <Badge
                fontSize="md"
                colorScheme={getSentimentColor(sentiment)}
                p={2}
                borderRadius="md"
              >
                {sentiment.toUpperCase()}
              </Badge>
              <Badge
                fontSize="md"
                colorScheme={getRecommendationColor(recommendation)}
                p={2}
                borderRadius="md"
              >
                {recommendation.toUpperCase()}
              </Badge>
            </Flex>
          </Flex>

          <Box>
            <Text mb={2}>Indice de confiance</Text>
            <Progress
              value={confidence * 100}
              colorScheme={getSentimentColor(sentiment)}
              borderRadius="md"
              size="lg"
              hasStripe
            />
            <Text mt={1} fontSize="sm" color="gray.500">
              {(confidence * 100).toFixed(1)}% de confiance
            </Text>
          </Box>

          <Box>
            <Heading size="sm" mb={3}>Raisons</Heading>
            <List spacing={2}>
              {reasons.map((reason, index) => (
                <ListItem key={index} fontSize="sm" color="gray.600">
                  • {reason}
                </ListItem>
              ))}
            </List>
          </Box>
        </VStack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat
          bg={bgColor}
          p={6}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <StatLabel>Articles Positifs</StatLabel>
          <StatNumber color="green.500">
            {stats.positiveNews}
          </StatNumber>
          <StatHelpText>sur {stats.totalNews} articles</StatHelpText>
        </Stat>

        <Stat
          bg={bgColor}
          p={6}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <StatLabel>Articles Neutres</StatLabel>
          <StatNumber color="gray.500">
            {stats.totalNews - stats.positiveNews - stats.negativeNews}
          </StatNumber>
          <StatHelpText>sur {stats.totalNews} articles</StatHelpText>
        </Stat>

        <Stat
          bg={bgColor}
          p={6}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <StatLabel>Articles Négatifs</StatLabel>
          <StatNumber color="red.500">
            {stats.negativeNews}
          </StatNumber>
          <StatHelpText>sur {stats.totalNews} articles</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        boxShadow="xl"
      >
        <Heading size="md" mb={4}>Sources analysées</Heading>
        <List spacing={3}>
          {sources.map((source, index) => (
            <ListItem 
              key={index}
              p={3}
              borderRadius="md"
              _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
            >
              <Flex justify="space-between" align="center">
                <Link 
                  href={source.url} 
                  isExternal
                  color={useColorModeValue('blue.600', 'blue.300')}
                  fontWeight="medium"
                >
                  {source.title} <ExternalLinkIcon mx="2px" />
                </Link>
                <Badge colorScheme={getSentimentColor(source.sentiment)}>
                  {source.sentiment}
                </Badge>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>
    </VStack>
  );
};

export default AnalysisResults; 