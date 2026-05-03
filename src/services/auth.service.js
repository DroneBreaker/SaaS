import { supabase } from '../lib/supabaseClient'

export const AuthService = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
          display_name: name,
          role: 'User',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`
        }
      }
    })

    if (error) throw error

    if (data.user) {
      // Create profile in public schema
      const { error: profileError } = await supabase.from('users').insert([{
        id: data.user.id,
        email: data.user.email,
        name: name,
        role: 'User',
        status: 'Active',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`
      }])
      
      if (profileError) {
        console.error('Failed to create user profile:', profileError)
      }
    }

    return data
  },
  
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}
