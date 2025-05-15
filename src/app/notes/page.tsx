import { createSupabaseClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Notes() {
  try {
    console.log('Environment variables:', {
      url: process.env.DATABASE_SUPABASE_URL,
      key: process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + '...'
    });

    const supabase = await createSupabaseClient();
    console.log('Supabase client created');
    
    // Önce basit bir sorgu deneyelim
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .limit(1);

    console.log('Query result:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>Database Error: {error.message}</p>
            <p className="text-sm mt-2">Error Code: {error.code}</p>
            <p className="text-sm mt-2">Error Details: {JSON.stringify(error.details)}</p>
            <p className="text-sm mt-2">Error Hint: {error.hint}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          <p>Database connection successful!</p>
          <p className="mt-2">Found {data?.length || 0} notes</p>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Server error:', error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>Server Error:</p>
          <pre className="mt-2 text-sm overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <p className="mt-2 text-sm">Stack trace:</p>
          <pre className="mt-1 text-sm overflow-auto">
            {error instanceof Error ? error.stack : ''}
          </pre>
        </div>
      </div>
    );
  }
} 