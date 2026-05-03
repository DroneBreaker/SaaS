import { supabase } from '../lib/supabaseClient'

import { createClient } from '@supabase/supabase-js'

// We create a secondary client with persistSession: false 
// This allows the Admin to create a new user without being logged out of their own session!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const adminAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
})

export const UsersService = {
  async fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (error) throw error
      return data || []
    } catch (err) {
      console.warn('Supabase not configured. Returning fallback users.', err)
      return [
        {
          id: 1,
          name: 'User Test',
          email: 'admin@saas.com',
          role: 'Admin',
          status: 'Active',
          avatar: 'https://ui-avatars.com/api/?name=User+Test&background=4f46e5&color=fff',
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane@saas.com',
          role: 'User',
          status: 'Active',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=0ea5e9&color=fff',
        }
      ]
    }
  },

  async createUser(userData) {
    try {
      // 1. First, create the actual user in Supabase Authentication
      const tempPassword = 'TempPassword123!' // The new user can reset this later

      const { data: authData, error: authError } = await adminAuthClient.auth.signUp({
        email: userData.email,
        password: tempPassword,
        options: {
          data: {
            name: userData.name,
            full_name: userData.name, // Supabase dashboard often looks for full_name
            display_name: userData.name,
            role: userData.role,
            avatar: userData.avatar
          }
        }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Failed to create auth user')
      }

      // 2. Then, insert their custom details into our public 'profiles' table
      const userToInsert = {
        id: authData.user.id, // Link the profile to the Auth UUID
        ...userData
      }

      const { data, error } = await supabase
        .from('users')
        .insert([userToInsert])
        .select()
        .single()

      if (error) throw error

      // Tell the admin the temporary password
      alert(`User created successfully! Their temporary password is: ${tempPassword}`)

      return data
    } catch (err) {
      console.warn('Supabase not configured or error creating user. Resolving mock data.', err)
      return { id: Math.floor(Math.random() * 1000) + 3, ...userData }
    }
  }
}
