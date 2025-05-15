import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
  try {
    const supabase = await createClient();
    const { data: notes, error } = await supabase.from("notes").select();

    if (error) {
      console.error('Supabase error:', error);
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            Error loading notes. Please try again later.
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="space-y-4">
          {notes?.map((note) => (
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
          An unexpected error occurred. Please try again later.
        </div>
      </div>
    );
  }
} 