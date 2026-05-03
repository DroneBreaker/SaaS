<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useReportsStore } from '../stores/reports'
import { storeToRefs } from 'pinia'

const reportsStore = useReportsStore()
const { savedReports } = storeToRefs(reportsStore)

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const jobs = [
  { id: 1, code: 'J0008-00106' },
  { id: 2, code: 'J0008-00105' },
  { id: 3, code: 'J0008-00104' },
  { id: 4, code: 'J0008-00103' },
  { id: 5, code: 'J0008-00102' },
  { id: 6, code: 'J0008-00101' },
]

const rigSites = [
  { id: 1, name: 'West Gemini', location: 'Angola', kitEquipment: 0, looseEquipment: 135 },
  { id: 2, name: 'Quenguela', location: 'Angola', kitEquipment: 12, looseEquipment: 71 },
  { id: 3, name: 'DS12', location: 'Angola', kitEquipment: 5, looseEquipment: 42 },
  { id: 4, name: 'Ensco DS8', location: 'Nigeria', kitEquipment: 8, looseEquipment: 64 },
]

const lgiStatus = {
  amberDue: 0,
  amberOverdue: 0,
  missingCocEq: 0,
  missingCocCcu: 0
}

const chartData = {
  labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'FINDINGS',
      backgroundColor: 'transparent',
      borderColor: '#eb6134', // Orange/Red color
      borderWidth: 2,
      pointBackgroundColor: '#eb6134',
      pointRadius: 4,
      data: [0, 0.02, 0.04, 0.06, 0.09, 0.11, 0.13, 0.15, 0.18]
    },
    {
      label: 'CHECKLISTS',
      backgroundColor: 'transparent',
      borderColor: '#60a5fa', // Blueish color
      borderWidth: 2,
      pointBackgroundColor: '#60a5fa',
      pointRadius: 0,
      borderDash: [5, 5],
      data: [] 
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'center',
      labels: {
        useBorderRadius: true,
        borderRadius: 2,
        boxWidth: 36,
        boxHeight: 12,
        color: '#64748b',
        font: {
            size: 11,
            weight: '700',
            family: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#334155',
      bodyColor: '#475569',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 12,
    }
  },
  scales: {
    y: {
      min: -1.0,
      max: 1.0,
      grid: {
        color: '#e2e8f0', // Light gray grid
        drawBorder: false,
      },
      ticks: {
        color: '#94a3b8',
        stepSize: 0.2,
        font: { size: 10 }
      }
    },
    x: {
      grid: {
        display: true,
        color: '#e2e8f0',
        drawBorder: false,
      },
      ticks: {
        color: '#94a3b8',
        font: { size: 10 }
      }
    }
  }
}
</script>

<template>
  <div class="animation-fade-in text-slate-700 w-full h-full flex flex-col gap-6 pb-10 overflow-y-auto pr-2">
    <!-- TOP ROW (Existing Layout) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full shrink-0">
      
      <!-- LEFT COLUMN -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        
        <!-- Recent Reports Card -->
        <div class="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden flex flex-col">
          <div class="px-6 py-5 border-b border-slate-100">
            <h2 class="text-[#64748b] text-sm font-bold tracking-wider">RECENT REPORTS</h2>
          </div>
          <div class="flex-1 p-2">
            <ul class="flex flex-col">
              <li v-for="report in savedReports" :key="report.id" class="px-4 py-3 flex justify-between items-center hover:bg-slate-50 transition-colors rounded-lg group">
                <span class="text-sm text-slate-400 font-medium">{{ report.date }}</span>
                <button 
                  @click="reportsStore.downloadReport(report)"
                  class="p-1.5 rounded-md hover:bg-slate-100 text-slate-300 hover:text-[#eb6134] transition-all"
                  title="Download Report"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </li>
              <li v-if="savedReports.length === 0" class="px-4 py-8 text-center">
                <p class="text-sm text-slate-400">No reports created yet.</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Recent Jobs Card -->
        <div class="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden flex flex-col flex-1">
          <div class="px-6 py-5 border-b border-slate-100">
            <h2 class="text-[#64748b] text-sm font-bold tracking-wider">RECENT JOBS</h2>
          </div>
          <div class="flex-1 p-2">
            <ul class="flex flex-col">
              <li v-for="job in jobs" :key="job.id" class="px-4 py-3 flex justify-between items-center hover:bg-slate-50 transition-colors rounded-lg group cursor-pointer">
                <span class="text-sm text-slate-400 font-medium">{{ job.code }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        
        <!-- Drops Chart Card -->
        <div class="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6">
          <h2 class="text-[#64748b] text-sm font-bold tracking-wider mb-6">DROPS</h2>
          <!-- Note: Padding and constraints force the chart to respect aspect ratios -->
          <div class="h-[400px] w-full relative">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Metrics Bottom Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Checklists -->
          <div class="flex flex-col gap-3">
            <h2 class="text-[#64748b] text-sm font-bold tracking-wider text-center mb-1">CHECKLISTS</h2>
            
            <div class="w-full border-2 border-slate-200 rounded-lg py-3 flex justify-center bg-slate-50/50">
              <span class="text-xs font-bold text-slate-500 tracking-wider">IN PROGRESS: 18</span>
            </div>
            
            <div class="w-full border-2 border-emerald-400/50 rounded-lg py-3 flex justify-center bg-emerald-50/30">
              <span class="text-xs font-bold text-slate-600 tracking-wider">PASSED: <span class="text-emerald-600">40</span></span>
            </div>
            
            <div class="w-full border-2 border-rose-400/50 rounded-lg py-3 flex justify-center bg-rose-50/30">
              <span class="text-xs font-bold text-slate-600 tracking-wider">FAILED: <span class="text-rose-600">16</span></span>
            </div>
          </div>

          <!-- Findings -->
          <div class="flex flex-col gap-3">
            <h2 class="text-[#64748b] text-sm font-bold tracking-wider text-center mb-1">FINDINGS</h2>
            
            <div class="w-full border-2 border-slate-200 rounded-lg py-3 flex justify-center bg-slate-50/50">
              <span class="text-xs font-bold text-slate-500 tracking-wider">IN PROGRESS: 10</span>
            </div>
            
            <div class="w-full border-2 border-slate-200 rounded-lg py-3 flex justify-center bg-slate-50/50">
              <span class="text-xs font-bold text-slate-500 tracking-wider">CLOSED: <span class="text-slate-600">8</span></span>
            </div>
          </div>
        </div>

      </div>
      
    </div>

    <!-- MIDDLE ROW: Status Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full shrink-0">
      
      <!-- LGI Status (Col Span 4) -->
      <div class="lg:col-span-4 bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 h-full">
        <h2 class="text-[#64748b] text-sm font-bold tracking-wider mb-6">LGI STATUS</h2>
        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <svg class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400 font-medium mb-0.5">Amber Due &lt; 30 days</span>
              <span class="text-sm font-bold text-slate-700">{{ lgiStatus.amberDue }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <svg class="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400 font-medium mb-0.5">Amber Overdue</span>
              <span class="text-sm font-bold text-slate-700">{{ lgiStatus.amberOverdue }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <svg class="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400 font-medium mb-0.5">Missing COC (Equipment)</span>
              <span class="text-sm font-bold text-slate-700">{{ lgiStatus.missingCocEq }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <svg class="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400 font-medium mb-0.5">Missing COC (CCU's)</span>
              <span class="text-sm font-bold text-slate-700">{{ lgiStatus.missingCocCcu }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Small Cards (Col Span 8) split into 2 columns -->
      <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <!-- Surveys & Jobs -->
        <div class="flex flex-col gap-6">
          <div class="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 flex flex-col justify-center items-center h-[162px]">
            <h2 class="text-[#64748b] text-sm font-bold tracking-wider self-start mb-auto">RECENT SURVEYS</h2>
            <span class="text-sm text-slate-400 font-medium mb-auto">No recent surveys available</span>
          </div>
          <div class="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 flex flex-col justify-center items-center h-[162px]">
            <h2 class="text-[#64748b] text-sm font-bold tracking-wider self-start mb-auto">NDT RECENT JOBS</h2>
            <span class="text-sm text-slate-400 font-medium mb-auto">No recent jobs available</span>
          </div>
        </div>
        <!-- Reports -->
        <div class="flex flex-col gap-6">
          <div class="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 flex flex-col justify-center items-center h-[162px]">
            <h2 class="text-[#64748b] text-sm font-bold tracking-wider self-start mb-auto">NDT RECENT REPORTS</h2>
            <span class="text-sm text-slate-400 font-medium mb-auto">No recent reports available</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM ROW: Rig Sites -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full mt-2 shrink-0">
      <div v-for="rig in rigSites" :key="rig.id" class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
        <div class="flex items-center gap-4 mb-5">
          <!-- Icon -->
          <div class="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center shrink-0 shadow-sm">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <!-- Title -->
          <div class="flex flex-col">
            <span class="text-sm font-bold text-slate-700">{{ rig.name }}</span>
            <span class="text-xs text-slate-400">{{ rig.location }}</span>
          </div>
        </div>
        <!-- Equipment Metrics -->
        <div class="flex flex-col gap-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div class="flex justify-between items-center w-full">
            <span class="font-medium">Kit Equipment</span>
            <span class="font-bold text-slate-700">{{ rig.kitEquipment }}</span>
          </div>
          <div class="flex justify-between items-center w-full">
            <span class="font-medium">Loose Equipment</span>
            <span class="font-bold text-slate-700">{{ rig.looseEquipment }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
