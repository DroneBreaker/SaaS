<script setup>
import { computed } from 'vue'
import logo from '../assets/logo.png'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// Extract all images from both current and completed work attachments
const allImages = computed(() => {
  const current = props.data.currentWorkAttachments || []
  const completed = props.data.completedWorkAttachments || []
  
  // Filter for items that look like images (hex check for preview data urls or extensions for remote urls)
  return [...current, ...completed].filter(url => 
    url.match(/\.(jpg|jpeg|png|gif|webp)/i) || url.startsWith('data:image')
  ).slice(0, 3) // Only take the first 3 for the specific photo grid
})
</script>

<template>
  <div id="pdf-content" class="pdf-wrapper">
    <!-- Header -->
    <div class="pdf-header flex justify-between items-end mb-4">
      <h1 class="text-3xl font-bold m-0 leading-none" style="color: #334b62">Daily Report</h1>
      <!-- Stitch Energy Logo -->
      <div class="logo-container flex items-center">
        <img :src="logo" alt="Stitch Energy Logo" class="h-14 w-auto object-contain" />
      </div>
    </div>

    <!-- Icons Row -->
    <div class="flex justify-between items-center mb-6 pb-2" style="border-bottom: 1px solid #cbd5e1">
      <div class="flex space-x-2">
        <div v-for="i in 7" :key="i" class="w-8 h-8 rounded-full border-2 flex items-center justify-center" style="border-color: #334b62; color: #334b62">
          <svg v-if="i===4" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background-color: #059669">
        {{ data.percentageCompleted || '0' }}%
      </div>
    </div>

    <!-- REPORT DETAILS -->
    <table class="pdf-table w-full mb-4">
      <thead>
        <tr>
          <th colspan="4" class="text-white py-1 text-center font-bold text-xs" style="background-color: #334b62">REPORT DETAILS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-bold w-[20%]" style="background-color: #f8fafc">Date</td>
          <td class="w-[30%]">{{ data.dateInspected || data.date }}</td>
          <td class="font-bold w-[20%]" style="background-color: #f8fafc">Client</td>
          <td class="w-[30%]">{{ data.client }}</td>
        </tr>
        <tr>
          <td class="font-bold" style="background-color: #f8fafc">Site/Vessel</td>
          <td>{{ data.siteName }}</td>
          <td class="font-bold" style="background-color: #f8fafc">Supervisor</td>
          <td>{{ data.supervisor }}</td>
        </tr>
        <tr>
          <td class="font-bold" style="background-color: #f8fafc">Job Number</td>
          <td>{{ data.jobNumber }}</td>
          <td style="background-color: #f8fafc"></td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <!-- TEAM DETAILS -->
    <table class="pdf-table w-full mb-4">
      <thead>
        <tr>
          <th colspan="4" class="text-white py-1 text-center font-bold text-xs" style="background-color: #334b62">TEAM DETAILS</th>
        </tr>
        <tr class="text-xs" style="background-color: #f8fafc">
          <th class="text-left py-1 px-2 border-r" style="border-color: #cbd5e1">Team Members</th>
          <th class="text-left py-1 px-2 border-r" style="border-color: #cbd5e1">Position</th>
          <th class="text-left py-1 px-2 border-r" style="border-color: #cbd5e1">Working Hours</th>
          <th class="text-left py-1 px-2">Permit Numbers</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in (data.team || [])" :key="member.name">
          <td>{{ member.name }}</td>
          <td>{{ member.position }}</td>
          <td>{{ member.workingHours }}</td>
          <td>{{ member.permitNumber }}</td>
        </tr>
        <tr v-if="!(data.team && data.team.length)">
          <td colspan="4" class="text-center italic py-2" style="color: #64748b">No team members listed</td>
        </tr>
      </tbody>
    </table>

    <!-- SCOPE OF WORK -->
    <table class="pdf-table w-full mb-4">
      <thead>
        <tr>
          <th colspan="4" class="text-white py-1 text-center font-bold text-xs" style="background-color: #334b62">SCOPE OF WORK</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-bold w-[20%]" style="background-color: #f8fafc">Days on Task</td>
          <td class="w-[30%]">{{ data.daysOnTask }}</td>
          <td class="font-bold w-[20%]" style="background-color: #f8fafc">Estimated Days</td>
          <td class="w-[30%]">{{ data.estimatedDaysRemaining }}</td>
        </tr>
        <tr>
          <th colspan="4" class="text-white py-1 px-2 text-left font-bold text-xs" style="background-color: #334b62">Current Work</th>
        </tr>
        <tr>
          <td colspan="4" class="p-2 min-h-[60px] align-top">
            <div class="whitespace-pre-wrap">{{ data.currentWork }}</div>
          </td>
        </tr>
        <tr>
          <th colspan="4" class="text-white py-1 px-2 text-left font-bold text-xs" style="background-color: #334b62">Summary of Completed Work</th>
        </tr>
        <tr>
          <td colspan="4" class="p-2 min-h-[60px] align-top">
            <div class="whitespace-pre-wrap">{{ data.completedWork }}</div>
          </td>
        </tr>
        <tr>
          <th colspan="4" class="text-white py-1 px-2 text-left font-bold text-xs" style="background-color: #334b62">Planned Work</th>
        </tr>
        <tr>
          <td colspan="4" class="whitespace-pre-wrap p-2 min-h-[40px] align-top">Continue scope of work as planned.</td>
        </tr>
      </tbody>
    </table>

    <!-- PHOTO DETAILS -->
    <table class="pdf-table w-full mb-4">
      <thead>
        <tr>
          <th colspan="3" class="text-white py-1 text-center font-bold text-xs" style="background-color: #334b62">PHOTO DETAILS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="i in 3" :key="i" class="w-1/3 text-center align-middle p-2 h-[120px]">
            <div v-if="allImages[i-1]" class="w-full h-full rounded border overflow-hidden" style="border-color: #cbd5e1">
              <img :src="allImages[i-1]" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-full h-full flex items-center justify-center text-xs" style="background-color: #e2e8f0; color: #94a3b8">
              No Image
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- REMARKS -->
    <table class="pdf-table w-full mb-4">
      <thead>
        <tr>
          <th colspan="2" class="text-white py-1 text-center font-bold text-xs" style="background-color: #334b62">REMARKS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-bold w-[25%] text-white border-r-0" style="background-color: #334b62">Completed and Sent by</td>
          <td class="w-[75%] pl-2">{{ data.supervisor }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Footer Space Filler -->
    <div class="mt-auto pt-8">
      <div class="mb-2 flex justify-between items-end pb-1 px-1" style="border-bottom: 4px solid #cbd5e1">
         <span class="text-xs" style="color: #64748b">Report No: {{ data.jobNumber || 'N/A' }}</span>
         <span class="text-xs" style="color: #64748b">Page 1 of 1</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pdf-wrapper {
  background-color: white;
  padding: 40px;
  width: 794px; /* A4 width at 96 DPI */
  min-height: 1123px; /* A4 height at 96 DPI */
  font-family: Arial, Helvetica, sans-serif;
  color: #1e293b;
  display: flex;
  flex-direction: column;
}

.pdf-table {
  border-collapse: collapse;
  font-size: 11px;
}

.pdf-table th, .pdf-table td {
  border: 1px solid #94a3b8;
  padding: 4px 6px;
  vertical-align: middle;
}
</style>
