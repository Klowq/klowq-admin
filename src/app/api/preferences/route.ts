import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPreferences, createPreference } from '@/lib/preferences-storage';
import { CreatePreferenceDto } from '@/types/preference';

// GET /api/preferences - Get all preferences
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const preferences = await getPreferences();
    return NextResponse.json(preferences);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// POST /api/preferences - Create a new preference
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreatePreferenceDto = await request.json();
    
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Preference name is required' },
        { status: 400 }
      );
    }

    const newPreference = await createPreference({
      name: body.name.trim(),
    });

    return NextResponse.json(newPreference, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create preference';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}

