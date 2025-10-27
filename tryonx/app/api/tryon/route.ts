import { NextRequest, NextResponse } from 'next/server';
import { simulateAIProcessing, generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const clothingId = formData.get('clothingId') as string;

    if (!image || !clothingId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await simulateAIProcessing(2000);

    const resultId = generateId();

    return NextResponse.json({
      success: true,
      resultId,
      message: 'Try-on processed successfully',
    });
  } catch (error) {
    console.error('Try-on API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process try-on' },
      { status: 500 }
    );
  }
}
