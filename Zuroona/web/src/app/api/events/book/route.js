import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get token from Authorization header instead of cookies for better performance
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { event_id, no_of_attendees, payment_id } = body;

    if (!event_id || !no_of_attendees || !payment_id) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${process.env.API_URL}/events/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id,
          no_of_attendees,
          payment_id,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return new NextResponse(
          JSON.stringify({ message: data.message || 'Failed to book event' }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new NextResponse(
        JSON.stringify(data),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return new NextResponse(
          JSON.stringify({ message: 'Request timeout' }),
          { status: 504, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error booking event:', error);
    return new NextResponse(
      JSON.stringify({ message: error.message || 'Internal server error' }),
      { status: error.status || 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
