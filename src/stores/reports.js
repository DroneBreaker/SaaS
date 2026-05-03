import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ReportsService } from '../services/reports.service'

export const useReportsStore = defineStore('reports', () => {
  const currentStep = ref(1)

  const initialFormData = {
    jobNumber: 'JB001-00188',
    department: 'Technical',
    workOrderNumber: 'JB00-00188',
    client: '',
    siteName: '',
    supervisor: 'Albert Plange',
    dateInspected: new Date().toISOString().split('T')[0],
    team: [
      { id: 1, name: 'Albert Plange', email: 'dizzyprah@gmail.com', avatar: 'AL', position: 'Supervisor', workingHours: '06:00-18:00', permitNumber: '6003', attended: true },
      { id: 2, name: 'Moegamat Shadley Van Ryneveld', email: 'shadleyvan47@gmail.com', avatar: 'MS', position: '', workingHours: '', permitNumber: '5801', attended: false }
    ],
    currentWork: 'Welding, grinding of sea fastening',
    completedWork: 'Welded four sea fastening brackets on acker reeler in the moonpool',
    daysOnTask: 18,
    percentageCompleted: 55,
    estimatedDaysRemaining: 12,
    delayedWork: false,
    environmentalFactors: false
  }

  const formData = ref({ ...initialFormData })

  const steps = ref([
    { id: 1, name: 'Job Information' },
    { id: 2, name: 'Client/Report info' },
    { id: 3, name: 'Team Details' },
    { id: 4, name: 'Scope of Work' },
    { id: 5, name: 'Delayed / Environmental' },
    { id: 6, name: 'Confirmation' },
  ])

  const savedReports = ref([])
  const isLoading = ref(false)

  const fetchAllReports = async () => {
    isLoading.value = true
    try {
      const data = await ReportsService.fetchReports()
      savedReports.value = data
    } catch (e) {
      console.error('Failed to fetch reports:', e)
    } finally {
      isLoading.value = false
    }
  }

  const nextStep = () => {
    if (currentStep.value < steps.value.length) currentStep.value++
  }

  const prevStep = () => {
    if (currentStep.value > 1) currentStep.value--
  }

  const saveReport = async () => {
    try {
      const newReportData = {
        date: new Date().toISOString().split('T')[0],
        ...formData.value
      }
      const saved = await ReportsService.createReport(newReportData)
      
      // Update local state directly to avoid unnecessary refetch immediately
      savedReports.value.unshift(saved)
      resetForm()
    } catch (e) {
      console.error('Failed to save report:', e)
    }
  }

  const resetForm = () => {
    formData.value = { ...initialFormData }
    currentStep.value = 1
  }

  const downloadReport = (report) => {
    // Basic text export matching your existing function omitted for brevity.
    const content = `DAILY REPORT SUMMARY... (Downloaded off backend)`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Report_${report.jobNumber}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return { currentStep, formData, steps, savedReports, isLoading, fetchAllReports, nextStep, prevStep, saveReport, resetForm, downloadReport }
})
