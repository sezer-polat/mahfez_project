import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();

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
} 