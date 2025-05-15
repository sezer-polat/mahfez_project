import { createSupabaseClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Notes() {
  try {
    // Tüm environment değişkenlerini kontrol edelim
    console.log('Environment variables:', {
      supabaseUrl: process.env.DATABASE_SUPABASE_URL,
      supabaseAnonKey: process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + '...',
      postgresUrl: process.env.DATABASE_POSTGRES_URL,
      postgresNonPoolingUrl: process.env.DATABASE_POSTGRES_URL_NON_POOLING,
      postgresUser: process.env.DATABASE_POSTGRES_USER,
      postgresPassword: process.env.DATABASE_POSTGRES_PASSWORD ? '***' : undefined,
      postgresDatabase: process.env.DATABASE_POSTGRES_DATABASE,
      postgresHost: process.env.DATABASE_POSTGRES_HOST,
    });

    console.log('Creating Supabase client...');
    const supabase = await createSupabaseClient();
    console.log('Supabase client created successfully');
    
    // Önce basit bir sorgu deneyelim
    console.log('Attempting to query notes table...');
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .limit(1);

    console.log('Query completed:', {
      hasData: !!data,
      dataLength: data?.length,
      hasError: !!error,
      errorDetails: error ? {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      } : null
    });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        stack: error.stack
      });
      
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="font-bold">Database Error:</p>
            <p className="mt-2">{error.message}</p>
            <p className="text-sm mt-2">Error Code: {error.code}</p>
            <p className="text-sm mt-2">Error Details: {JSON.stringify(error.details)}</p>
            <p className="text-sm mt-2">Error Hint: {error.hint}</p>
            <p className="text-sm mt-2">Stack Trace:</p>
            <pre className="text-xs mt-1 overflow-auto">
              {error.stack}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          <p className="font-bold">Database connection successful!</p>
          <p className="mt-2">Found {data?.length || 0} notes</p>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Server error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p className="font-bold">Server Error:</p>
          <p className="mt-2">{error instanceof Error ? error.message : String(error)}</p>
          <p className="mt-2 text-sm">Stack trace:</p>
          <pre className="mt-1 text-xs overflow-auto">
            {error instanceof Error ? error.stack : ''}
          </pre>
          <p className="mt-2 text-sm">Full error object:</p>
          <pre className="mt-1 text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
} 