import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UsersService } from '../services/users.service'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const isLoading = ref(false)

  const fetchUsers = async () => {
    isLoading.value = true
    try {
      const data = await UsersService.fetchUsers()
      users.value = data
    } catch (e) {
      console.error('Failed to fetch users:', e)
    } finally {
      isLoading.value = false
    }
  }

  const addUser = async (userObj) => {
    try {
      const savedUser = await UsersService.createUser({
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        status: 'Active',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj.name)}&background=10b981&color=fff`
      })
      users.value.push(savedUser)
    } catch (e) {
      console.error('Failed to create user:', e)
    }
  }

  return { users, isLoading, fetchUsers, addUser }
})
