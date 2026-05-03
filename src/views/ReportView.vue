<script setup>
import { computed, watch, ref } from 'vue'
import { useReportsStore } from '../stores/reports'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()
const reportsStore = useReportsStore()
const { currentStep, formData, steps } = storeToRefs(reportsStore)
const { nextStep, prevStep, saveReport } = reportsStore

const formErrors = ref({})

const validateStep = (step) => {
  formErrors.value = {}
  let isValid = true

  if (step === 2) {
    if (!formData.value.workOrderNumber) {
      formErrors.value.workOrderNumber = 'Work Order Number is required'
      isValid = false
    }
    if (!formData.value.client) {
      formErrors.value.client = 'Client name is required'
      isValid = false
    }
    if (!formData.value.siteName) {
      formErrors.value.siteName = 'Site name is required'
      isValid = false
    }
  } else if (step === 3) {
    if (formData.value.team.length === 0) {
      formErrors.value.team = 'At least one team member is required'
      isValid = false
    }
  } else if (step === 4) {
    if (!formData.value.currentWork) {
      formErrors.value.currentWork = 'Current work description is required'
      isValid = false
    }
  }

  return isValid
}

const handleNext = () => {
  if (validateStep(currentStep.value)) {
    nextStep()
  }
}

const handleSave = () => {
  saveReport()
  router.push('/')
}

const totalSteps = computed(() => steps.value.length)

const departments = ['Technical', 'Operations', 'Safety', 'Management']
const supervisors = ['Albert Plange', 'John Doe', 'Jane Smith']
const jobNumbers = ['JB001-00188', 'JB001-00189', 'JB001-00190']
const workingHoursOptions = ['06:00-18:00 (Day Shift)', '18:00-06:00 (Night Shift)', '00:00-12:00', '12:00-00:00']

// Sync Job Number with Work Order Number
watch(() => formData.value.jobNumber, (newVal) => {
  if (newVal && newVal !== 'other') {
    formData.value.workOrderNumber = newVal
  }
})

</script>

<template>
  <div class="report-container">
    <!-- Daily Report Badge -->
    <div class="absolute top-4 right-8 z-10">
      <span class="bg-[#eb6134] text-white px-4 py-1 rounded text-sm font-semibold shadow-sm">Daily Report</span>
    </div>

    <!-- Progress Stepper -->
    <div class="stepper-wrapper mb-12">
      <div class="stepper">
        <div v-for="step in totalSteps" :key="step" class="step-item" :class="{ 'active': currentStep >= step }">
          <div class="step-circle">{{ step }}</div>
          <div v-if="step < totalSteps" class="step-line" :class="{ 'active': currentStep > step }"></div>
          <span v-if="currentStep === step" class="step-label">{{ steps[step-1].name }}</span>
        </div>
      </div>
    </div>

    <!-- Background Tech Pattern -->
    <div class="tech-bg-overlay">
      <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" class="opacity-10">
        <path d="M100 100 L700 100 L700 500 L100 500 Z" fill="none" stroke="currentColor" stroke-width="0.5" />
        <path d="M100 100 L200 50 L800 50 L700 100" fill="none" stroke="currentColor" stroke-width="0.5" />
        <path d="M700 100 L800 50 L800 450 L700 500" fill="none" stroke="currentColor" stroke-width="0.5" />
        <circle cx="400" cy="300" r="150" fill="none" stroke="currentColor" stroke-width="0.2" />
        <circle cx="400" cy="300" r="200" fill="none" stroke="currentColor" stroke-width="0.1" />
        <line x1="0" y1="0" x2="800" y2="600" stroke="currentColor" stroke-width="0.1" />
        <line x1="800" y1="0" x2="0" y2="600" stroke="currentColor" stroke-width="0.1" />
      </svg>
    </div>

    <!-- Form Content -->
    <div class="form-card-container">
      <transition name="fade-slide" mode="out-in">
        <!-- Step 1: Job Information -->
        <div v-if="currentStep === 1" key="step1" class="form-card">
          <h2 class="form-title">Job Information</h2>
          <div class="space-y-6 mt-8">
            <div class="form-group flex items-center justify-between gap-8">
              <label class="form-label mb-0 whitespace-nowrap">Select Your Job Number:</label>
              <div class="select-wrapper flex-1 max-w-[400px]">
                <select v-model="formData.jobNumber" class="form-select">
                  <option v-for="job in jobNumbers" :key="job" :value="job">{{ job }}</option>
                  <option value="other">Other / Manual Entry</option>
                </select>
                <div class="select-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Manual Entry Field -->
            <transition name="fade-slide">
              <div v-if="formData.jobNumber === 'other' || !jobNumbers.includes(formData.jobNumber)" class="form-group flex items-center justify-between gap-8">
                <label class="form-label mb-0 whitespace-nowrap">Enter Job Number Manually:</label>
                <div class="flex-1 max-w-[400px]">
                  <input 
                    v-model="formData.jobNumber" 
                    type="text" 
                    class="form-input" 
                    placeholder="e.g. JB999-00123"
                    @blur="formData.jobNumber === '' ? formData.jobNumber = jobNumbers[0] : null"
                  >
                </div>
              </div>
            </transition>
          </div>
          <div class="flex flex-col items-center mt-10">
            <button @click="handleNext" class="btn-primary">Next</button>
            <button class="mt-4 text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Step 2: Client and Report Information -->
        <div v-else-if="currentStep === 2" key="step2" class="form-card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="form-title !text-left !mb-0">Client and Report Information</h2>
            <div class="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">Job Number</span>
              <span class="text-sm font-bold text-[#334b62]">{{ formData.jobNumber === 'other' ? 'Manual Entry' : formData.jobNumber }}</span>
            </div>
          </div>
          <div class="form-grid mt-6">
            <div class="form-group">
              <label class="form-label">What is your Department:</label>
              <div class="select-wrapper">
                <select v-model="formData.department" class="form-select">
                  <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                </select>
                <div class="select-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">What is your Work Order Number: *</label>
              <input v-model="formData.workOrderNumber" type="text" class="form-input" :class="{'border-red-500': formErrors.workOrderNumber}" placeholder="e.g. JB00-00188">
              <span v-if="formErrors.workOrderNumber" class="text-xs text-red-500 mt-1">{{ formErrors.workOrderNumber }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Who is the client: *</label>
              <input v-model="formData.client" type="text" class="form-input" :class="{'border-red-500': formErrors.client}" placeholder="Enter Client Name">
              <span v-if="formErrors.client" class="text-xs text-red-500 mt-1">{{ formErrors.client }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">What is the site name: *</label>
              <input v-model="formData.siteName" type="text" class="form-input" :class="{'border-red-500': formErrors.siteName}" placeholder="Enter Site Name">
              <span v-if="formErrors.siteName" class="text-xs text-red-500 mt-1">{{ formErrors.siteName }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Who is your supervisor: *</label>
              <div class="select-wrapper">
                <select v-model="formData.supervisor" class="form-select">
                  <option v-for="s in supervisors" :key="s" :value="s">{{ s }}</option>
                </select>
                <div class="select-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">What is the date inspected: *</label>
              <div class="relative">
                <input v-model="formData.dateInspected" type="date" class="form-input pr-10">
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4 mt-8">
            <button @click="prevStep" class="btn-secondary">Back</button>
            <button @click="handleNext" class="btn-primary">Next</button>
          </div>
        </div>

        <!-- Step 3: Team Details -->
        <div v-else-if="currentStep === 3" key="step3" class="form-card !p-6">
          <h2 class="form-title mb-6">Team Details</h2>
          
          <div class="team-list space-y-4">
            <div v-for="member in formData.team" :key="member.id" class="team-member-card">
              <!-- Avatar & Name -->
              <div class="flex items-center gap-4 min-w-[200px]">
                <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#334b62] font-bold border border-slate-200 shadow-sm">
                  {{ member.avatar }}
                </div>
                <div>
                  <h3 class="font-semibold text-slate-800 text-sm leading-tight">{{ member.name }}</h3>
                  <p class="text-xs text-slate-400">{{ member.email }}</p>
                </div>
              </div>

              <!-- Inputs -->
              <div class="flex-1 grid grid-cols-3 gap-4">
                <div class="form-group">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Position:</label>
                  <input v-model="member.position" type="text" class="form-input-sm" placeholder="Enter position">
                </div>
                <div class="form-group">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours:</label>
                  <div class="select-wrapper">
                    <select v-model="member.workingHours" class="form-select-sm">
                      <option value="" disabled>Select hours</option>
                      <option v-for="opt in workingHoursOptions" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                    <div class="select-arrow-sm text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Permit Number:</label>
                  <input v-model="member.permitNumber" type="text" class="form-input-sm" placeholder="Permit #">
                </div>
              </div>

              <!-- Attendance Toggle -->
              <div class="min-w-[120px] flex justify-end">
                <button 
                  @click="member.attended = !member.attended"
                  class="attendance-toggle"
                  :class="member.attended ? 'attended' : 'absent'"
                >
                  <span v-if="member.attended" class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Attended
                  </span>
                  <span v-else class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Absent
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="formData.team.length === 0" class="py-20 text-center">
            <p class="text-slate-400">No team details available. Add team members to proceed.</p>
            <p v-if="formErrors.team" class="text-red-500 text-sm mt-2 font-semibold">{{ formErrors.team }}</p>
          </div>

          <div class="flex items-center justify-center gap-4 mt-8">
            <button @click="prevStep" class="btn-secondary">Back</button>
            <button @click="handleNext" class="btn-primary">Next</button>
          </div>
        </div>

        <!-- Step 4: Scope of Work -->
        <div v-else-if="currentStep === 4" key="step4" class="form-card">
          <h2 class="form-title mb-8">Scope of Work</h2>
          
          <div class="space-y-8">
            <!-- Current Work -->
            <div class="editor-container">
              <label class="form-label !mb-2">Current Work:</label>
              <div class="editor-toolbar">
                <button class="toolbar-btn font-bold">B</button>
                <button class="toolbar-btn italic">I</button>
                <button class="toolbar-btn underline">U</button>
                <button class="toolbar-btn line-through">S</button>
                <button class="toolbar-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 11-5.656-5.656l-1.102 1.101" />
                  </svg>
                </button>
              </div>
              <textarea 
                v-model="formData.currentWork" 
                class="form-textarea" 
                :class="{'border-red-500': formErrors.currentWork}"
                placeholder="What is the current work being performed?"
                rows="4"
              ></textarea>
              <span v-if="formErrors.currentWork" class="text-xs text-red-500 mt-1">{{ formErrors.currentWork }}</span>
            </div>

            <!-- Summary of Completed Work -->
            <div class="editor-container">
              <label class="form-label !mb-2">Summary of Completed Work:</label>
              <div class="editor-toolbar">
                <button class="toolbar-btn font-bold">B</button>
                <button class="toolbar-btn italic">I</button>
                <button class="toolbar-btn underline">U</button>
                <button class="toolbar-btn line-through">S</button>
                <button class="toolbar-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 11-5.656-5.656l-1.102 1.101" />
                  </svg>
                </button>
              </div>
              <textarea 
                v-model="formData.completedWork" 
                class="form-textarea" 
                placeholder="Summarize the work completed today..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-center gap-4 mt-12">
            <button @click="prevStep" class="btn-secondary">Back</button>
            <button @click="handleNext" class="btn-primary">Next</button>
          </div>
        </div>

        <!-- Step 5: Delayed / Environmental -->
        <div v-else-if="currentStep === 5" key="step5" class="form-card">
          <h2 class="form-title mb-10">Delayed/Environmental</h2>
          
          <div class="space-y-6 max-w-2xl mx-auto">
            <div class="form-row-between">
              <label class="form-label mb-0">Days on Task:</label>
              <input v-model="formData.daysOnTask" type="number" class="form-input-inline" placeholder="18">
            </div>

            <div class="form-row-between">
              <label class="form-label mb-0">Percentage Completed:</label>
              <input v-model="formData.percentageCompleted" type="number" class="form-input-inline" placeholder="55">
            </div>

            <div class="form-row-between">
              <label class="form-label mb-0">Estimated Days Remaining:</label>
              <input v-model="formData.estimatedDaysRemaining" type="number" class="form-input-inline" placeholder="12">
            </div>

            <div class="form-row-between pt-4">
              <label class="form-label mb-0">Reason for Delayed Work:</label>
              <div class="flex items-center gap-6">
                <label class="radio-label">
                  <input type="radio" v-model="formData.delayedWork" :value="true" class="form-radio">
                  <span>Yes</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="formData.delayedWork" :value="false" class="form-radio">
                  <span>No</span>
                </label>
              </div>
            </div>

            <div class="form-row-between">
              <label class="form-label mb-0">Any Environmental Factors:</label>
              <div class="flex items-center gap-6">
                <label class="radio-label">
                  <input type="radio" v-model="formData.environmentalFactors" :value="true" class="form-radio">
                  <span>Yes</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="formData.environmentalFactors" :value="false" class="form-radio">
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center gap-4 mt-16">
            <button @click="prevStep" class="btn-secondary">Back</button>
            <button @click="handleNext" class="btn-primary">Next</button>
          </div>
        </div>

        <!-- Step 6: Confirmation -->
        <div v-else-if="currentStep === 6" key="step6" class="form-card flex flex-col items-center justify-center py-16">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-slate-800 mb-2">Confirmation of Daily Report</h2>
          <p class="text-slate-500 mb-8 text-center max-w-md">Are you sure you want to save this Daily Report?<br><span class="text-sm">Please review all information before submitting.</span></p>

          <div class="flex items-center gap-4">
            <button @click="prevStep" class="btn-secondary">Back</button>
            <button @click="handleSave" class="btn-primary !bg-[#0f172a] !px-12">Yes, save!</button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Help Icon -->
    <div class="fixed bottom-8 right-8">
      <button class="w-12 h-12 bg-[#334b62] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2a3e51] transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-2 2-3 2-3s-2-1-2-1-2 1-2 1" />
          <circle cx="12" cy="12" r="9" />
          <path d="M10 14h4" />
        </svg>
        <!-- Replaced with a more generic headset-like icon in spirit -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.report-container {
  @apply relative w-full h-full flex flex-col items-center pt-8;
  background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
}

.tech-bg-overlay {
  @apply absolute inset-0 pointer-events-none z-0;
}

/* Stepper Styles */
.stepper-wrapper {
  @apply w-full max-w-4xl px-4 z-10;
}

.stepper {
  @apply flex items-center justify-between;
}

.step-item {
  @apply relative flex flex-col items-center flex-1;
}

.step-circle {
  @apply w-10 h-10 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-slate-400 font-semibold transition-all duration-300 z-10;
}

.step-item.active .step-circle {
  @apply border-[#334b62] bg-[#334b62] text-white shadow-md;
}

.step-line {
  @apply absolute h-[2px] bg-slate-200 top-5 left-[50%] w-full -z-0;
}

.step-line.active {
  @apply bg-[#334b62];
}

.step-label {
  @apply absolute top-12 text-xs font-bold text-[#334b62] whitespace-nowrap;
}

/* Form Card Styles */
.form-card-container {
  @apply w-full max-w-4xl px-4 mt-12 z-10;
}

.form-card {
  @apply bg-white/70 backdrop-blur-md rounded-2xl p-10 shadow-xl border border-white/50 min-h-[400px];
}

.form-title {
  @apply text-2xl font-semibold text-slate-800 text-center;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6;
}

.team-member-card {
  @apply flex items-center gap-6 p-4 bg-white/50 rounded-xl border border-slate-100 hover:border-[#334b62]/30 transition-all;
}

.form-input-sm, .form-select-sm {
  @apply w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-[#eb6134]/30 focus:border-[#eb6134]/50 transition-all;
}

.form-select-sm {
  @apply appearance-none;
}

.select-arrow-sm {
  @apply absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none;
}

.attendance-toggle {
  @apply px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center min-w-[110px];
}

.attendance-toggle.attended {
  @apply bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100;
}

.attendance-toggle.absent {
  @apply bg-red-50 text-red-600 border border-red-100 hover:bg-red-100;
}

.editor-container {
  @apply flex flex-col;
}

.editor-toolbar {
  @apply flex items-center gap-2 p-2 border-x border-t border-slate-200 bg-slate-50 rounded-t-lg;
}

.toolbar-btn {
  @apply w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 transition-colors;
}

.form-textarea {
  @apply w-full bg-white border border-slate-200 rounded-b-lg px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-[#eb6134]/20 focus:border-[#eb6134] transition-all resize-none;
}

.form-row-between {
  @apply flex items-center justify-between gap-8;
}

.form-input-inline {
  @apply w-[400px] bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-[#eb6134]/20 focus:border-[#eb6134] transition-all;
}

.radio-label {
  @apply flex items-center gap-3 cursor-pointer text-slate-600 font-medium;
}

.form-radio {
  @apply w-5 h-5 accent-[#334b62] cursor-pointer;
}

.form-group {
  @apply flex flex-col;
}

.form-label {
  @apply text-sm font-medium text-slate-600 mb-2;
}

.form-select, .form-input {
  @apply w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-[#eb6134]/20 focus:border-[#eb6134] transition-all;
}

.select-wrapper {
  @apply relative;
}

.form-select {
  @apply appearance-none;
}

.select-arrow {
  @apply absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400;
}

/* Button Styles */
.btn-primary {
  @apply bg-[#0f172a] text-white px-10 py-2.5 rounded-lg font-semibold hover:bg-[#1e293b] active:scale-95 transition-all shadow-md;
}

.btn-secondary {
  @apply text-slate-600 px-6 py-2.5 font-semibold hover:text-slate-800 transition-colors;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
