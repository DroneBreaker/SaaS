<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const userInitials = computed(() => {
  const name = user.value?.name || 'AL'
  const parts = name.split(' ')
  return parts.length > 1 ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase() : name.substring(0, 2).toUpperCase()
})
</script>

<template>
  <div class="profile-container animation-fade-in">
    <div class="max-w-4xl mx-auto py-10 px-6">
      
      <!-- Header Section -->
      <div class="flex items-center gap-8 mb-12">
        <div class="w-32 h-32 rounded-3xl bg-[#c2ced9] flex items-center justify-center text-slate-600 font-bold text-4xl shadow-lg border-4 border-white tracking-widest">
          {{ userInitials }}
        </div>
        <div>
          <h1 class="text-4xl font-bold text-slate-800 mb-2">{{ user.name }}</h1>
          <p class="text-slate-500 font-medium flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Active Account — {{ user.role }}
          </p>
        </div>
      </div>

      <!-- Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Personal Information Card -->
        <div class="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 flex flex-col">
          <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#eb6134]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h2>
          
          <div class="space-y-6">
            <div class="info-item">
              <label class="info-label">Full Name</label>
              <p class="info-value">{{ user.name }}</p>
            </div>
            <div class="info-item">
              <label class="info-label">Email Address</label>
              <p class="info-value">{{ user.email }}</p>
            </div>
            <div class="info-item">
              <label class="info-label">Job Title</label>
              <p class="info-value">Technical Supervisor</p>
            </div>
          </div>
        </div>

        <!-- System Access Card -->
        <div class="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 flex flex-col">
          <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#eb6134]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Account Security
          </h2>
          
          <div class="space-y-6">
            <div class="info-item">
              <label class="info-label">Current Role</label>
              <p class="info-value capitalize">{{ user.role }}</p>
            </div>
            <div class="info-item">
              <label class="info-label">Region Access</label>
              <p class="info-value">Global / Angola Operations</p>
            </div>
            <div class="info-item">
              <label class="info-label">Last Login</label>
              <p class="info-value text-slate-400">Today, 09:12 AM</p>
            </div>
          </div>
        </div>

        <!-- Action Card -->
        <div class="md:col-span-2 bg-slate-800 rounded-2xl p-8 text-white flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold mb-1">Need to update your details?</h3>
            <p class="text-slate-400 text-sm">Contact your system administrator for major changes.</p>
          </div>
          <button class="bg-[#eb6134] hover:bg-[#d5562e] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95">
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.profile-container {
  @apply h-full w-full bg-[#f8fafc];
}

.info-item {
  @apply flex flex-col gap-1;
}

.info-label {
  @apply text-[11px] font-bold text-slate-400 uppercase tracking-wider;
}

.info-value {
  @apply text-slate-700 font-semibold;
}

.animation-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
