import { NextResponse } from 'next/server';

// In-memory storage for messages (replace with database later)
let messages = [
  {
    id: 1,
    text: 'Welcome to the chat!',
    type: 'system',
    timestamp: new Date().toISOString(),
  }
];

export async function GET() {
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const message = await request.json();
  
  const newMessage = {
    ...message,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  };
  
  messages.push(newMessage);
  return NextResponse.json(newMessage);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }
  
  messages = messages.filter(msg => msg.id !== Number(id));
  return NextResponse.json({ success: true });
} 