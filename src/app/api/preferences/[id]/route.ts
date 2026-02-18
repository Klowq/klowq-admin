import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPreferenceById, updatePreference, deletePreference } from '@/lib/preferences-storage';
import { UpdatePreferenceDto } from '@/types/preference';

// GET /api/preferences/[id] - Get a single preference
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const preference = await getPreferenceById(id);
    
    if (!preference) {
      return NextResponse.json(
        { error: 'Preference not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(preference);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch preference' },
      { status: 500 }
    );
  }
}

// PUT /api/preferences/[id] - Update a preference
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body: UpdatePreferenceDto = await request.json();

    if (body.name !== undefined && body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Preference name cannot be empty' },
        { status: 400 }
      );
    }

    const updatedPreference = await updatePreference(id, {
      name: body.name?.trim(),
    });
    
    if (!updatedPreference) {
      return NextResponse.json(
        { error: 'Preference not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPreference);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update preference';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}

// DELETE /api/preferences/[id] - Delete a preference
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await deletePreference(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Preference not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Preference deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete preference' },
      { status: 500 }
    );
  }
}

