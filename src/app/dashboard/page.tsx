'use client';

import { useState, useEffect } from 'react';
import { Recommendation } from '../../types';
import { RecommendationAnalysis } from '../../lib/analysis';

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<RecommendationAnalysis | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations');
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        setError('An error occurred while fetching recommendations.');
        console.error(error);
      }
    };
    fetchRecommendations();
  }, []);

  const handleViewAnalysis = async (id: number) => {
    try {
      const response = await fetch(`/api/recommendations/${id}/analysis`);
      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }
      const data = await response.json();
      setSelectedAnalysis(data);
    } catch (error) {
      setError('An error occurred while fetching analysis.');
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="w-full max-w-4xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4">Ticker</th>
              <th className="border-b p-4">Rec. Date</th>
              <th className="border-b p-4">Current Price</th>
              <th className="border-b p-4">Target Price</th>
              <th className="border-b p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec) => (
              <tr key={rec.id}>
                <td className="border-b p-4">{rec.ticker}</td>
                <td className="border-b p-4">{new Date(rec.recommendationDate).toLocaleDateString()}</td>
                <td className="border-b p-4">{rec.currentPrice}</td>
                <td className="border-b p-4">{rec.targetPrice}</td>
                <td className="border-b p-4">
                  <button
                    onClick={() => handleViewAnalysis(rec.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedAnalysis && (
        <div className="mt-8 p-4 border rounded-md bg-gray-100 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Analysis for {selectedAnalysis.targetPrice}</h2>
          <p>Current Price: {selectedAnalysis.currentPrice}</p>
          <p>Price at Recommendation: {selectedAnalysis.priceAtRecommendation}</p>
          <p>Target Price: {selectedAnalysis.targetPrice}</p>
          <p>Target Met: {selectedAnalysis.isHit ? 'Yes' : 'No'}</p>
          {/* Add a chart for price history here later */}
        </div>
      )}
    </main>
  );
}
