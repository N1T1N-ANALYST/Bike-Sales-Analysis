import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      items: [],
      count: 0,
    });
  } catch (error) {
    console.error('Wardrobe API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wardrobe' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, clothingItemId, tryOnResultId } = body;

    if (!userId || !clothingItemId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const wardrobeItemId = generateId();

    return NextResponse.json({
      success: true,
      wardrobeItemId,
      message: 'Item added to wardrobe',
    });
  } catch (error) {
    console.error('Wardrobe API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to wardrobe' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from wardrobe',
    });
  } catch (error) {
    console.error('Wardrobe API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from wardrobe' },
      { status: 500 }
    );
  }
}
