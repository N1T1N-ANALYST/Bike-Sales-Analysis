import { NextRequest, NextResponse } from 'next/server';
import { mockRecommendations } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const occasion = searchParams.get('occasion');
    const style = searchParams.get('style');

    let filteredRecommendations = [...mockRecommendations];

    if (occasion && occasion !== 'all') {
      filteredRecommendations = filteredRecommendations.filter(
        (rec) => rec.outfit.occasion === occasion
      );
    }

    return NextResponse.json({
      success: true,
      recommendations: filteredRecommendations,
      count: filteredRecommendations.length,
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      recommendations: mockRecommendations,
      message: 'Personalized recommendations generated',
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
