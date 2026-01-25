import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function name() {
    const supabase = createSupabaseServerClient();
    const {data} = await supabase.auth.getSession()

    return (
    <pre className="p-6">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
    
}