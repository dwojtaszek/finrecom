import { GET } from './route';
import { prismaMock } from '../../../lib/__mocks__/prisma';
import { NextRequest } from 'next/server';
import { Recommendation } from '../../../types';

describe('/api/recommendations', () => {
  it('should return a list of recommendations', async () => {
    const mockRecommendations: Recommendation[] = [
      {
        id: 1,
        ticker: 'AAPL',
        recommendationDate: new Date(),
        targetPrice: 200,
        currentPrice: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        ticker: 'GOOG',
        recommendationDate: new Date(),
        targetPrice: 3000,
        currentPrice: 2500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.recommendation.findMany.mockResolvedValue(mockRecommendations);

    const req = new NextRequest('http://localhost/api/recommendations');
    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockRecommendations);
  });
});
