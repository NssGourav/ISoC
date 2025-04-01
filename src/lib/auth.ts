import { supabase, insertData } from './supabase'
import type { Database } from './database.types'
import { AuthError, AuthResponse, User } from '@supabase/supabase-js'
import { PostgrestResponse } from '@supabase/supabase-js'

type Student = Database['public']['Tables']['students']['Row']
type Organization = Database['public']['Tables']['organizations']

// Add a delay function with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add retry logic with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 5000 // Increased initial delay to 5 seconds
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (error instanceof AuthError && 
          (error.message?.includes('Too Many Requests') || 
           error.message?.includes('rate limit exceeded'))) {
        const delayTime = initialDelay * Math.pow(2, attempt);
        console.log(`Rate limited (attempt ${attempt + 1}/${maxRetries}). Waiting ${delayTime/1000} seconds...`);
        await delay(delayTime);
      } else {
        throw error;
      }
    }
  }
  
  throw lastError;
}

export async function signUpStudent(email: string, password: string, fullName: string) {
  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log('Starting student signup process...')
    console.log('Email:', normalizedEmail)
    console.log('Full Name:', fullName)
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      return {
        success: false,
        data: null,
        error: new Error('Please enter a valid email address')
      };
    }

    // Step 1: Create auth user with retry logic
    console.log('Attempting to create auth user...')
    const authResponse = await retryWithBackoff<AuthResponse>(() =>
      supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'student'
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      })
    );

    if (authResponse.error) {
      console.error('Auth error details:', {
        message: authResponse.error.message,
        status: authResponse.error.status,
        name: authResponse.error.name
      });

      // Handle specific error cases
      if (authResponse.error.message?.includes('email already registered')) {
        return {
          success: false,
          data: null,
          error: new Error('This email is already registered. Please use a different email.')
        };
      } else if (authResponse.error.message?.includes('rate limit exceeded') || 
                 authResponse.error.message?.includes('Too Many Requests') ||
                 authResponse.error.status === 429) {
        return {
          success: false,
          data: null,
          error: new Error('Registration is temporarily unavailable. Please wait 5-10 minutes before trying again.')
        };
      } else if (authResponse.error.status === 400) {
        return {
          success: false,
          data: null,
          error: new Error('Invalid registration data. Please check your email and password.')
        };
      }
      
      throw authResponse.error;
    }

    if (!authResponse.data.user) {
      console.error('No user data returned from auth signup')
      return { 
        success: false,
        data: null, 
        error: new Error('Failed to create user') 
      }
    }

    const user = authResponse.data.user;
    console.log('Auth user created successfully:', {
      userId: user.id,
      email: user.email,
      role: user.user_metadata?.role
    })

    // Step 2: Create student profile using the new helper function
    console.log('Creating student profile...')
    const { data: profileData, error: profileError } = await insertData('students', {
      id: user.id,
      full_name: fullName,
      email: normalizedEmail,
      created_at: new Date().toISOString()
    });

    if (profileError) {
      console.error('Profile creation error details:', {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details
      })
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.signOut()
      throw profileError
    }

    if (!profileData) {
      console.error('No profile data returned from insert')
      await supabase.auth.signOut()
      throw new Error('Failed to create student profile')
    }

    console.log('Student profile created successfully:', profileData)
    return { 
      success: true,
      data: {
        user,
        profile: profileData
      },
      error: null 
    }
  } catch (error) {
    console.error('Signup error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return { 
      success: false,
      data: null, 
      error: error as AuthError 
    }
  }
}

export async function signUpOrganization(email: string, password: string, name: string, description?: string) {
  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log('Starting organization signup process...')
    console.log('Email:', normalizedEmail)
    console.log('Name:', name)
    console.log('Description:', description)
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.error('Invalid email format:', normalizedEmail)
      return {
        success: false,
        data: null,
        error: new Error('Please enter a valid email address')
      };
    }

    // Validate name
    if (!name.trim()) {
      console.error('Empty organization name')
      return {
        success: false,
        data: null,
        error: new Error('Organization name is required')
      };
    }

    // Validate password
    if (!password || password.length < 6) {
      console.error('Invalid password length:', password?.length)
      return {
        success: false,
        data: null,
        error: new Error('Password must be at least 6 characters long')
      };
    }

    // Step 1: Create auth user with retry logic
    console.log('Attempting to create auth user...')
    const authResponse = await retryWithBackoff<AuthResponse>(() =>
      supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name,
            role: 'organization'
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      })
    );

    if (authResponse.error) {
      console.error('Auth error details:', {
        message: authResponse.error.message,
        status: authResponse.error.status,
        name: authResponse.error.name
      });

      // Handle specific error cases
      if (authResponse.error.message?.includes('email already registered')) {
        return {
          success: false,
          data: null,
          error: new Error('This email is already registered. Please use a different email.')
        };
      } else if (authResponse.error.message?.includes('rate limit exceeded') || 
                 authResponse.error.message?.includes('Too Many Requests') ||
                 authResponse.error.status === 429) {
        return {
          success: false,
          data: null,
          error: new Error('Registration is temporarily unavailable. Please wait 5-10 minutes before trying again.')
        };
      } else if (authResponse.error.status === 400) {
        return {
          success: false,
          data: null,
          error: new Error('Invalid registration data. Please check your email and password.')
        };
      }
      
      throw authResponse.error;
    }

    if (!authResponse.data.user) {
      console.error('No user data returned from auth signup')
      return { 
        success: false,
        data: null, 
        error: new Error('Failed to create user') 
      }
    }

    const user = authResponse.data.user;
    console.log('Auth user created successfully:', {
      userId: user.id,
      email: user.email,
      role: user.user_metadata?.role
    })

    // Step 2: Create organization profile using the new helper function
    console.log('Creating organization profile...')
    const organizationData = {
      id: user.id,
      name: name.trim(),
      email: normalizedEmail,
      description: description?.trim() || null,
      created_at: new Date().toISOString()
    };
    console.log('Organization data to be inserted:', organizationData);

    const { data: profileData, error: profileError } = await insertData('organizations', organizationData);

    if (profileError) {
      console.error('Profile creation error details:', {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details
      })
      // If profile creation fails, we should clean up the auth user
      console.log('Cleaning up auth user due to profile creation failure...')
      await supabase.auth.signOut()
      throw profileError
    }

    if (!profileData) {
      console.error('No profile data returned from insert')
      await supabase.auth.signOut()
      throw new Error('Failed to create organization profile')
    }

    console.log('Organization profile created successfully:', profileData)
    return { 
      success: true,
      data: {
        user,
        profile: profileData
      },
      error: null 
    }
  } catch (error) {
    console.error('Signup error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return { 
      success: false,
      data: null, 
      error: error as AuthError 
    }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error }
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (error) {
    return { user: null, error }
  }
}