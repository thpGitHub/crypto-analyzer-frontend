import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { TimeIcon, RepeatIcon, StarIcon } from '@chakra-ui/icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GlobalStatsProps {
  marketCap: number;
  volume24h: number;
  btcDominance: number;
  trendData: {
    labels: string[];
    values: number[];
  };
}

const GlobalStats: React.FC<GlobalStatsProps> = ({ marketCap, volume24h, btcDominance, trendData }) => {
  const chartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Market Trend',
        data: trendData.values,
        fill: true,
        borderColor: useColorModeValue('rgb(49, 130, 206)', 'rgb(99, 179, 237)'),
        backgroundColor: useColorModeValue(
          'rgba(49, 130, 206, 0.1)',
          'rgba(99, 179, 237, 0.1)'
        ),
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tendance du marché (24h)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: { top: 20, bottom: 20 },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)'),
        titleColor: useColorModeValue('#1A202C', '#FFFFFF'),
        bodyColor: useColorModeValue('#1A202C', '#FFFFFF'),
        borderColor: useColorModeValue('rgba(226, 232, 240, 1)', 'rgba(45, 55, 72, 1)'),
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        grid: {
          color: useColorModeValue('rgba(226, 232, 240, 0.5)', 'rgba(45, 55, 72, 0.5)'),
        },
        ticks: {
          callback: function(tickValue: number | string) {
            const value = Number(tickValue);
            return `$${(value / 1e12).toFixed(2)}T`;
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  const statBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat
          bg={statBg}
          p={6}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Icon as={TimeIcon} color="blue.500" boxSize={5} mr={2} />
            <StatLabel fontSize="lg">Capitalisation Totale</StatLabel>
          </Box>
          <StatNumber fontSize="2xl" color="blue.500">
            ${(marketCap / 1e9).toFixed(2)}B
          </StatNumber>
          <StatHelpText>Mise à jour en temps réel</StatHelpText>
        </Stat>
        
        <Stat
          bg={statBg}
          p={6}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Icon as={RepeatIcon} color="green.500" boxSize={5} mr={2} />
            <StatLabel fontSize="lg">Volume (24h)</StatLabel>
          </Box>
          <StatNumber fontSize="2xl" color="green.500">
            ${(volume24h / 1e9).toFixed(2)}B
          </StatNumber>
          <StatHelpText>Dernières 24 heures</StatHelpText>
        </Stat>
        
        <Stat
          bg={statBg}
          p={6}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Icon as={StarIcon} color="orange.500" boxSize={5} mr={2} />
            <StatLabel fontSize="lg">Dominance BTC</StatLabel>
          </Box>
          <StatNumber fontSize="2xl" color="orange.500">
            {btcDominance.toFixed(2)}%
          </StatNumber>
          <StatHelpText>Part de marché du Bitcoin</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box
        bg={statBg}
        p={6}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        height="400px"
      >
        <Line options={options} data={chartData} />
      </Box>
    </Box>
  );
};

export default GlobalStats; 