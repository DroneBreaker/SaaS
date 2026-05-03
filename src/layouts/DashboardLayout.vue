<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Get user initials (e.g. "User Test" -> "UT")
const userInitials = computed(() => {
  const name = authStore.user?.name || 'AL'
  const parts = name.split(' ')
  return parts.length > 1 ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase() : name.substring(0, 2).toUpperCase()
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-[#f4f6f8] overflow-hidden font-sans text-slate-700">
    <!-- Sidebar (Narrow Blue) -->
    <aside class="w-[70px] bg-[#3383c5] flex flex-col items-center py-6 shrink-0 z-20 shadow-md">
      
      <!-- User Initials Circle (Clickable Link) -->
      <RouterLink 
        to="/profile" 
        class="w-12 h-12 rounded-full bg-[#c2ced9] flex items-center justify-center text-slate-600 font-bold text-lg mb-8 shadow-sm tracking-widest border border-white/20 transition-all hover:scale-110 hover:shadow-lg active:scale-95 group overflow-hidden relative"
        title="My Profile"
      >
        <span class="z-10">{{ userInitials }}</span>
        <div class="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300"></div>
      </RouterLink>
      
      <!-- Nav Links -->
      <nav class="flex-1 flex flex-col gap-6 w-full items-center">
        <!-- Home -->
        <RouterLink 
          to="/" 
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all text-white border-2"
          :class="route.path === '/' ? 'border-white/40 bg-white/20' : 'border-transparent hover:bg-white/10 opacity-80'"
          title="Dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </RouterLink>
        
        <!-- Reports -->
        <RouterLink 
          to="/reports" 
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all text-white border-2"
          :class="route.path === '/reports' ? 'border-white/40 bg-white/20' : 'border-transparent hover:bg-white/10 opacity-80'"
          title="Daily Reports"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </RouterLink>
      </nav>

      <!-- Logout / Settings at bottom -->
      <button 
        @click="handleLogout" 
        class="w-10 h-10 rounded-full border-2 border-transparent flex items-center justify-center transition-all text-white hover:bg-white/10 opacity-70 hover:opacity-100 mt-auto"
        title="Logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </aside>

    <!-- Main View Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f4f6f8] relative">
      <!-- Contained page content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10">
        <div class="w-full h-full">
            <RouterView v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </RouterView>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
