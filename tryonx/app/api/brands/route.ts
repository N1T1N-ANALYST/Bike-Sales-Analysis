import { NextRequest, NextResponse } from 'next/server';
import { mockClothingItems } from '@/lib/mockData';
import { generateId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brandId = searchParams.get('brandId');

    if (brandId) {
      const brandItems = mockClothingItems.filter(
        (item) => item.brand === brandId
      );
      return NextResponse.json({
        success: true,
        items: brandItems,
        count: brandItems.length,
      });
    }

    return NextResponse.json({
      success: true,
      items: mockClothingItems,
      count: mockClothingItems.length,
    });
  } catch (error) {
    console.error('Brands API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brand items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const brandName = formData.get('brandName') as string;
    const contactEmail = formData.get('contactEmail') as string;

    if (!brandName || !contactEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const requestId = generateId();

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Partnership request submitted successfully',
    });
  } catch (error) {
    console.error('Brands API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit partnership request' },
      { status: 500 }
    );
  }
}
