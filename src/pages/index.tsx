import { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
  Heading,
  Text,
  Box,
  useColorModeValue,
  Icon,
  HStack,
  Avatar,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import GlobalStats from '../components/GlobalStats';
import SearchHistory from '../components/SearchHistory';
import Navbar from '../components/Navbar';
import axios from 'axios';
import AnalysisResults from '../components/AnalysisResults';

interface GlobalStatsData {
  marketCap: number;
  volume24h: number;
  btcDominance: number;
  trendData: {
    labels: string[];
    values: number[];
  };
}

interface Source {
  title: string;
  url: string;
  sentiment: string;
}

interface AnalysisData {
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

export default function Home() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<Array<{
    crypto: string;
    timestamp: string;
    sentiment: string;
  }>>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStatsData>({
    marketCap: 0,
    volume24h: 0,
    btcDominance: 0,
    trendData: {
      labels: [],
      values: []
    }
  });

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    // Charger les stats globales depuis l'API
    const fetchGlobalStats = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/crypto/global-stats');
        setGlobalStats(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
        // Utiliser des données de test en cas d'erreur
        setGlobalStats({
          marketCap: 2.5e12,
          volume24h: 125e9,
          btcDominance: 45.5,
          trendData: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            values: [2.4e12, 2.45e12, 2.42e12, 2.48e12, 2.52e12, 2.5e12]
          }
        });
      }
    };

    fetchGlobalStats();

    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer le nom d'une cryptomonnaie",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResults(null);

    try {
      const response = await axios.get(`http://localhost:3002/api/crypto/analyze/${searchValue.toLowerCase()}`);
      const { analysis } = response.data;

      const newSearch = {
        crypto: searchValue,
        timestamp: new Date().toISOString(),
        sentiment: analysis.sentiment
      };

      const updatedHistory = [newSearch, ...searchHistory].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

      setAnalysisResults({
        crypto: searchValue,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        recommendation: analysis.recommendation,
        reasons: analysis.reasons,
        stats: analysis.stats,
        sources: analysis.sources
      });

      toast({
        title: "Analyse terminée",
        description: `${analysis.sentiment.toUpperCase()} - ${analysis.recommendation.toUpperCase()}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser la cryptomonnaie pour le moment",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />
      <Box pt="72px" pb={8}>
        <Container maxW="container.xl">
          {/* Header */}
          <HStack justify="space-between" mb={8}>
            <Box>
              <Heading size="2xl" mb={2} bgGradient="linear(to-r, blue.500, teal.500)" bgClip="text">
                Analyse Crypto
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Analysez les sentiments du marché pour votre cryptomonnaie
              </Text>
            </Box>
            <Avatar name="User" src="/avatar.png" size="md" />
          </HStack>

          {/* Main Content */}
          <VStack spacing={8} align="stretch">
            <Box 
              bg={cardBg} 
              p={6} 
              borderRadius="xl" 
              boxShadow="xl"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <GlobalStats {...globalStats} />
            </Box>

            <Box 
              bg={cardBg} 
              p={6} 
              borderRadius="xl" 
              boxShadow="xl"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <VStack spacing={4}>
                <InputGroup size="lg">
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Entrez le nom d'une crypto (ex: ethereum)"
                    bg={useColorModeValue('white', 'gray.700')}
                    border="2px"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    _hover={{
                      borderColor: useColorModeValue('gray.300', 'gray.500')
                    }}
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: 'none'
                    }}
                    fontSize="md"
                    height="56px"
                  />
                  <InputRightElement width="auto" right="4px" top="4px">
                    <Button
                      colorScheme="blue"
                      px={8}
                      height="48px"
                      onClick={handleSearch}
                      leftIcon={isLoading ? <Spinner size="sm" /> : <SearchIcon />}
                      isLoading={isLoading}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg'
                      }}
                      transition="all 0.2s"
                    >
                      Analyser
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </VStack>
            </Box>

            {analysisResults && (
              <AnalysisResults {...analysisResults} />
            )}

            <Box 
              bg={cardBg} 
              p={6} 
              borderRadius="xl" 
              boxShadow="xl"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <SearchHistory 
                searches={searchHistory}
                onSelect={(crypto) => {
                  setSearchValue(crypto);
                  handleSearch();
                }}
              />
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
} 