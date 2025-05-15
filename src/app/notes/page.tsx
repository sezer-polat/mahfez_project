import { createSupabaseClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Notes() {
  try {
    const supabase = await createSupabaseClient();
    
    // Önce basit bir sorgu deneyelim
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>Database Error: {error.message}</p>
            <p className="text-sm mt-2">Error Code: {error.code}</p>
            <p className="text-sm mt-2">Error Details: {JSON.stringify(error.details)}</p>
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
        </div>
      </div>
    );
  }
} 