import { useState } from 'react';
import {
  Box,
  Container,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  SimpleGrid,
  Card,
  CardBody,
  List,
  ListItem,
  Link,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function Home() {
  const [cryptocurrency, setCryptocurrency] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/api/crypto/analyze/${cryptocurrency}`);
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError('Erreur lors de l\'analyse. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case 'buy': return 'green';
      case 'sell': return 'red';
      default: return 'yellow';
    }
  };

  const chartData = analysis ? {
    labels: ['Positif', 'Négatif', 'Neutre'],
    datasets: [{
      data: [
        analysis.stats.positiveNews,
        analysis.stats.negativeNews,
        analysis.stats.totalNews - analysis.stats.positiveNews - analysis.stats.negativeNews
      ],
      backgroundColor: ['#48BB78', '#F56565', '#ECC94B']
    }]
  } : null;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading mb={4}>Analyse Crypto</Heading>
          <Text fontSize="lg" color="gray.600">
            Analysez les sentiments du marché pour votre cryptomonnaie
          </Text>
        </Box>

        <Box>
          <VStack spacing={4}>
            <Input
              placeholder="Entrez le nom d'une crypto (ex: ethereum)"
              value={cryptocurrency}
              onChange={(e) => setCryptocurrency(e.target.value)}
              size="lg"
            />
            <Button
              leftIcon={<SearchIcon />}
              colorScheme="blue"
              onClick={analyzeData}
              isLoading={loading}
              size="lg"
              width="full"
            >
              Analyser
            </Button>
          </VStack>
        </Box>

        {error && (
          <Box bg="red.100" p={4} borderRadius="md">
            <Text color="red.600">{error}</Text>
          </Box>
        )}

        {analysis && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Recommandation</Heading>
                  <Badge
                    colorScheme={getRecommendationColor(analysis.recommendation)}
                    fontSize="2xl"
                    p={2}
                    borderRadius="md"
                  >
                    {analysis.recommendation.toUpperCase()}
                  </Badge>
                  <List spacing={2}>
                    {analysis.reasons.map((reason, index) => (
                      <ListItem key={index}>• {reason}</ListItem>
                    ))}
                  </List>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Statistiques</Heading>
                  <Box height="200px">
                    {chartData && <Pie data={chartData} />}
                  </Box>
                  <Stat>
                    <StatLabel>Niveau de confiance</StatLabel>
                    <StatNumber>{(analysis.confidence * 100).toFixed(1)}%</StatNumber>
                    <Progress
                      value={analysis.confidence * 100}
                      colorScheme={analysis.confidence > 0.7 ? 'green' : 'orange'}
                    />
                    <StatHelpText>
                      Basé sur {analysis.stats.totalNews} articles
                    </StatHelpText>
                  </Stat>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
} 