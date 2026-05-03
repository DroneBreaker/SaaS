<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isSignUp = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const successMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''
  successMsg.value = ''
  
  if (isSignUp.value) {
    if (!name.value) {
      errorMsg.value = 'Full name is required.'
      return
    }
    const result = await authStore.register(email.value, password.value, name.value)
    if (result.success) {
      isSignUp.value = false
      password.value = '' // clear the password for security
      successMsg.value = 'Account created successfully! Please sign in.'
    } else {
      errorMsg.value = result.error || 'Registration failed.'
    }
  } else {
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
      router.push('/')
    } else {
      errorMsg.value = result.error || 'Invalid credentials.'
    }
  }
}
</script>

<template>
  <div class="flex h-screen w-screen bg-[#f4f6f8] overflow-hidden font-sans text-slate-700">
    <!-- Left Server/Auth Box Panel -->
    <div class="w-full md:w-[450px] lg:w-[480px] bg-[#0f172a] h-full flex flex-col justify-center items-center p-8 shadow-2xl z-10 text-slate-200">
      
      <!-- Brand heading -->
      <div class="flex items-center gap-3 mb-10 w-full max-w-sm pl-2">
        <div class="w-10 h-10 rounded shadow bg-gradient-to-br from-[#2db6fa] to-[#60a5fa] flex items-center justify-center text-white font-bold text-xl">
          S
        </div>
        <span class="text-3xl font-bold text-white tracking-wide">SaaS<span class="text-[#818cf8]">App</span></span>
      </div>

      <!-- Auth Form Box -->
      <div class="w-full max-w-sm bg-[#1e293b] border border-[#334155] rounded-xl p-8 shadow-xl">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white">{{ isSignUp ? 'Create an account' : 'Sign in to your account' }}</h2>
        </div>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="isSignUp">
            <label for="name" class="block text-sm font-medium text-slate-300">
              Full Name
            </label>
            <div class="mt-1">
              <input 
                id="name" 
                name="name" 
                type="text" 
                :required="isSignUp" 
                v-model="name"
                class="appearance-none block w-full px-3 py-2 border border-[#334155] rounded-md shadow-sm bg-[#0f172a] placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-100 transition-colors"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-300">
              Email address
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                v-model="email"
                class="appearance-none block w-full px-3 py-2 border border-[#334155] rounded-md shadow-sm bg-[#0f172a] placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-100 transition-colors"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-300">
              Password
            </label>
            <div class="mt-1">
              <input 
                id="password" 
                name="password" 
                type="password" 
                autocomplete="current-password" 
                required 
                v-model="password"
                class="appearance-none block w-full px-3 py-2 border border-[#334155] rounded-md shadow-sm bg-[#0f172a] placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-100 transition-colors"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 bg-white focus:ring-indigo-500 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-slate-400">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-[#818cf8] hover:text-[#6366f1] transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <p v-if="errorMsg" class="text-sm text-rose-400 bg-rose-400/10 p-2 rounded border border-rose-500/20">{{ errorMsg }}</p>
          <p v-if="successMsg" class="text-sm text-emerald-400 bg-emerald-400/10 p-2 rounded border border-emerald-500/20">{{ successMsg }}</p>

          <div>
            <button type="submit" class="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#5b4eff] hover:bg-[#4a3deb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b4eff] focus:ring-offset-[#1e293b] transition-colors duration-200">
              {{ isSignUp ? 'Sign up' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div class="mt-8 text-center text-sm">
          <p class="text-slate-400">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <button @click="isSignUp = !isSignUp; errorMsg = ''; successMsg = ''" type="button" class="font-medium text-[#818cf8] hover:text-[#6366f1] transition-colors ml-1 focus:outline-none">
              {{ isSignUp ? 'Sign in' : 'Sign up' }}
            </button>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Right Panel (Light Gray Empty Background matching the image) -->
    <div class="hidden md:block flex-1 bg-[#f4f6f8] h-full"></div>
  </div>
</template>
