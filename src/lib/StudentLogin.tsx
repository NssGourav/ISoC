import { supabase } from './supabase'
import { signUpStudent } from '../lib/auth' // Make sure it's .ts not .tsx

export const signUpStudent = async (email: string, password: string, full_name: string) => {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        user_type: 'student'
      }
    }
  })
  
  if (authError) throw authError

  // 2. Create student profile
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('students')
      .insert([
        {
          id: authData.user.id,
          email,
          full_name,
        }
      ])

    if (profileError) throw profileError
  }

  return authData
}

export const signUpOrganization = async (
  name: string,
  email: string,
  password: string,
  description?: string
) => {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        organization_name: name,
        user_type: 'organization'
      }
    }
  })
  
  if (authError) throw authError

  // 2. Create organization profile
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('organizations')
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          description,
        }
      ])

    if (profileError) throw profileError
  }

  return authData
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}