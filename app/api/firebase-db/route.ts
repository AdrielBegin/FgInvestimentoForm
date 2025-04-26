import { NextResponse } from 'next/server';
import { addDoc, collection } from 'firebase/firestore';
import db from '../../config/firebaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, "alunos"), body);
    return NextResponse.json({ id: docRef.id }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
