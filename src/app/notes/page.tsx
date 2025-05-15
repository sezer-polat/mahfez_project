import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
  try {
    console.log('Creating Supabase client...');
    const supabase = await createClient();
    console.log('Supabase client created successfully');

    console.log('Fetching notes...');
    const { data: notes, error } = await supabase.from("notes").select();
    console.log('Notes fetch result:', { notes, error });

    if (error) {
      console.error('Supabase error:', error);
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>Error loading notes: {error.message}</p>
            <p className="text-sm mt-2">Error code: {error.code}</p>
          </div>
        </div>
      );
    }

    if (!notes || notes.length === 0) {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
            No notes found.
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="p-4 bg-white rounded-lg shadow">
              <p>{note.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Server error:', error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>An unexpected error occurred:</p>
          <pre className="mt-2 text-sm overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
} 