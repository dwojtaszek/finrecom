import { Recommendation } from '../types';

export interface RecommendationAnalysis {
  currentPrice: number;
  priceAtRecommendation: number;
  targetPrice: number;
  isHit: boolean;
  priceHistory: { date: string; price: number }[];
}

export async function analyzeRecommendation(
  recommendation: Recommendation
): Promise<RecommendationAnalysis> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const ticker = recommendation.ticker;

  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    throw new Error('Alpha Vantage API key not configured');
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  const timeSeries = data['Time Series (Daily)'];
  const priceHistory = Object.entries(timeSeries)
    .map(([date, values]: [string, any]) => ({
      date,
      price: parseFloat(values['4. close']),
    }))
    .filter(
      (item) => new Date(item.date) >= new Date(recommendation.recommendationDate)
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const currentPrice = priceHistory[priceHistory.length - 1].price;
  const isHit = priceHistory.some((item) => item.price >= recommendation.targetPrice);

  return {
    currentPrice,
    priceAtRecommendation: recommendation.currentPrice,
    targetPrice: recommendation.targetPrice,
    isHit,
    priceHistory,
  };
}
