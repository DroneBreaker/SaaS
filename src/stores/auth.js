import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthService } from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // Try to load initial user from localStorage or keep null
  const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  const user = ref(savedUser)

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'Admin')

  async function login(email, password) {
    try {
      const data = await AuthService.login(email, password)
      
      // Map supabase user / mock user to local state
      user.value = {
        name: data.user.user_metadata?.name || email.split('@')[0],
        email: data.user.email,
        role: data.user.user_metadata?.role || 'User', // Use user_metadata for role
        avatar: data.user.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${email}&background=4f46e5&color=fff`,
        token: data.session?.access_token
      }
      
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: error.message }
    }
  }

  async function register(email, password, name) {
    try {
      const data = await AuthService.signUp(email, password, name)
      
      // The user requested to manually sign in after account creation.
      // If Supabase auto-created a session (because email confirmation is off),
      // we log them out immediately so they are forced to use the Sign In form.
      if (data.session) {
        await AuthService.logout()
      }
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      return { success: false, error: error.message }
    }
  }

  async function logout() {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      localStorage.removeItem('user')
    }
  }

  return { user, isAuthenticated, isAdmin, login, register, logout }
})
