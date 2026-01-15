import env from '#start/env'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = env.get('SUPABASE_URL')
const supabaseKey = env.get('SUPABASE_ANON_KEY')

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
