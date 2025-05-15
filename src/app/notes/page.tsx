import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default async function Notes() {
  try {
    // Supabase bağlantısını doğrudan test edelim
    const supabase = createClient(
      process.env.DATABASE_SUPABASE_URL || '',
      process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Basit bir sorgu deneyelim
    const { data, error } = await supabase
      .from('notes')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          <p>Database connection successful!</p>
          <p>Query result: {JSON.stringify(data)}</p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>Error: {error instanceof Error ? error.message : String(error)}</p>
          <pre className="mt-2 text-xs overflow-auto">
            {error instanceof Error ? error.stack : ''}
          </pre>
        </div>
      </div>
    );
  }
} 