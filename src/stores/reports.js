import { defineStore } from 'pinia'
import { ref, createApp } from 'vue'
import { ReportsService } from '../services/reports.service'
import { useAuthStore } from './auth'
import DailyReportPDF from '../components/DailyReportPDF.vue'
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js'

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
    environmentalFactors: false,
    sendEmail: false,
    sendToEmail: '',
    currentWorkFiles: [],
    completedWorkFiles: []
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
    const authStore = useAuthStore()
    try {
      const newReportData = {
        user_id: authStore.user?.id,
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

  const downloadReport = async (report) => {
    console.log('Starting PDF generation for report:', report.jobNumber)
    
    // Create a temporary div to mount the PDF component
    const mountPoint = document.createElement('div')
    // Hide the mount point but keep it in the DOM structure for rendering accuracy
    mountPoint.style.position = 'absolute'
    mountPoint.style.top = '0'
    mountPoint.style.left = '0'
    mountPoint.style.zIndex = '-1'
    mountPoint.style.opacity = '0'
    mountPoint.style.pointerEvents = 'none'
    mountPoint.style.width = '794px' // A4 width at 96 DPI
    document.body.appendChild(mountPoint)

    try {
      // Mount the component
      const pdfApp = createApp(DailyReportPDF, { data: report })
      pdfApp.mount(mountPoint)

      // Wait for Vue to finish rendering the DOM
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const element = mountPoint.firstElementChild
      if (!element) throw new Error('PDF element not found after mounting')

      // html2pdf options
      const opt = {
        margin: 0,
        filename: `Daily_Report_${report.jobNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }

      console.log('Triggering html2pdf...')
      // Generate and download the PDF
      await html2pdf().set(opt).from(element).save()
      console.log('PDF generation complete')
      
      // Clean up
      pdfApp.unmount()
    } catch (e) {
      console.error('Failed to generate PDF:', e)
      alert('Failed to generate PDF. Please check the console for errors.')
    } finally {
      if (document.body.contains(mountPoint)) {
        document.body.removeChild(mountPoint)
      }
    }
  }

  return { currentStep, formData, steps, savedReports, isLoading, fetchAllReports, nextStep, prevStep, saveReport, resetForm, downloadReport }
})
