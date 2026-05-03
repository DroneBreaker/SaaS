<script setup>
import { ref } from 'vue'
import { useUsersStore } from '../stores/users'
import { useAuthStore } from '../stores/auth'

const usersStore = useUsersStore()
const authStore = useAuthStore()

const showAddModal = ref(false)
const newUserName = ref('')
const newUserEmail = ref('')
const newUserRole = ref('User')

function handleAddUser() {
  if (!newUserName.value || !newUserEmail.value) return
  
  usersStore.addUser({
    name: newUserName.value,
    email: newUserEmail.value,
    role: newUserRole.value
  })
  
  showAddModal.value = false
  newUserName.value = ''
  newUserEmail.value = ''
  newUserRole.value = 'User'
}
</script>

<template>
  <div class="animation-fade-in relative z-0">
    <header class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 pb-6 border-b border-slate-700/50 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          User Management
        </h1>
        <p class="text-sm text-slate-400 mt-1">Manage your team members and roles.</p>
      </div>
      
      <!-- Only show button if admin -->
      <button 
        v-if="authStore.isAdmin"
        @click="showAddModal = true"
        class="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add User
      </button>
    </header>

    <main class="bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-xl shadow-2xl p-6">
      <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        Team Members
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="user in usersStore.users" 
          :key="user.id" 
          class="group bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="relative shrink-0">
                <img :src="user.avatar" :alt="user.name" class="w-12 h-12 rounded-full ring-2 ring-slate-700 group-hover:ring-indigo-500/50 transition-all" />
                <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-medium text-slate-100 flex items-center gap-2 truncate">
                  {{ user.name }}
                </h3>
                <p class="text-sm text-slate-400 truncate">{{ user.email }}</p>
              </div>
            </div>
            
            <span 
              class="shrink-0 px-3 py-1 text-xs font-semibold flex items-center gap-1.5 rounded-full ml-2"
              :class="[
                user.role === 'Admin' 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'bg-slate-700 bg-opacity-50 text-slate-300 border border-slate-600'
              ]"
            >
              <svg v-if="user.role === 'Admin'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.584l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clip-rule="evenodd" />
              </svg>
              {{ user.role }}
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- Add User Modal (Admin Only) -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="showAddModal = false"></div>
        
        <div class="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden transform transition-all sm:max-w-lg w-full">
          <div class="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center">
            <h3 class="text-lg font-medium text-white">Add New User</h3>
            <button @click="showAddModal = false" class="text-slate-400 hover:text-white transition-colors">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleAddUser" class="p-6">
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input v-model="newUserName" type="text" required class="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 bg-slate-900/50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-100" placeholder="John Doe">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input v-model="newUserEmail" type="email" required class="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 bg-slate-900/50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-100" placeholder="john@example.com">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Account Role</label>
                <select v-model="newUserRole" class="block w-full px-3 py-2 border border-slate-600 rounded-lg shadow-sm bg-slate-900/50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-100">
                  <option value="User">Regular User</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
            </div>
            
            <div class="mt-8 flex justify-end gap-3">
              <button type="button" @click="showAddModal = false" class="px-4 py-2 border border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none transition-colors">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors shadow-indigo-500/30">
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
