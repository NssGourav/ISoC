// Change from supabase.tsx to supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Helper function to insert data into a table
export async function insertData<T extends keyof Database['public']['Tables']>(
  table: T,
  data: Database['public']['Tables'][T]['Insert']
) {
  try {
    console.log(`Attempting to insert data into ${String(table)}:`, data)
    
    // First, check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from(String(table))
      .select('id')
      .limit(1)
    
    if (tableError) {
      console.error(`Error checking table ${String(table)}:`, tableError)
      throw new Error(`Table ${String(table)} might not exist or be accessible`)
    }

    // Perform the insert operation
    const { data: result, error } = await supabase
      .from(String(table))
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error(`Error inserting data into ${String(table)}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    console.log(`Successfully inserted data into ${String(table)}:`, result)
    return { data: result, error: null }
  } catch (error) {
    console.error(`Unexpected error inserting data into ${String(table)}:`, error)
    return { data: null, error }
  }
}

// Helper function to get data from a table
export async function getData<T extends keyof Database['public']['Tables']>(
  table: T,
  query?: {
    column?: keyof Database['public']['Tables'][T]['Row']
    value?: any
  }
) {
  try {
    console.log(`Attempting to fetch data from ${String(table)}${query ? ` with query: ${JSON.stringify(query)}` : ''}`)
    
    let queryBuilder = supabase.from(String(table)).select()

    if (query?.column && query?.value) {
      queryBuilder = queryBuilder.eq(String(query.column), query.value)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error(`Error fetching data from ${String(table)}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    console.log(`Successfully fetched data from ${String(table)}:`, data)
    return { data, error: null }
  } catch (error) {
    console.error(`Unexpected error fetching data from ${String(table)}:`, error)
    return { data: null, error }
  }
}

// Helper function to update data in a table
export async function updateData<T extends keyof Database['public']['Tables']>(
  table: T,
  id: string,
  data: Database['public']['Tables'][T]['Update']
) {
  try {
    console.log(`Attempting to update data in ${String(table)} for id ${id}:`, data)
    
    const { data: result, error } = await supabase
      .from(String(table))
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating data in ${String(table)}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    console.log(`Successfully updated data in ${String(table)}:`, result)
    return { data: result, error: null }
  } catch (error) {
    console.error(`Unexpected error updating data in ${String(table)}:`, error)
    return { data: null, error }
  }
}

// Helper function to delete data from a table
export async function deleteData<T extends keyof Database['public']['Tables']>(
  table: T,
  id: string
) {
  try {
    console.log(`Attempting to delete data from ${String(table)} for id ${id}`)
    
    const { error } = await supabase
      .from(String(table))
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting data from ${String(table)}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    console.log(`Successfully deleted data from ${String(table)}`)
    return { error: null }
  } catch (error) {
    console.error(`Unexpected error deleting data from ${String(table)}:`, error)
    return { error }
  }
}

// Helper functions for database queries
export async function getAllStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
  
  if (error) throw error
  return data
}

export async function getAllOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
  
  if (error) throw error
  return data
}