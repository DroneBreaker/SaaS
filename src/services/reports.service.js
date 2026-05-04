import { supabase } from '../lib/supabaseClient'

export const ReportsService = {
  async fetchReports() {
    let supabaseData = []
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      supabaseData = data || []
    } catch (err) {
      console.warn('Supabase not configured or reports table missing.', err)
    }

    // Always fetch local data as well to ensure nothing is lost
    const localData = localStorage.getItem('mockedReports')
    const mockedReports = localData ? JSON.parse(localData) : []

    // Combine both (you might want to de-duplicate by ID if needed, but for now just merging)
    return [...supabaseData, ...mockedReports].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    )
  },

  async createReport(reportData) {
    try {
      // Destructure email and file fields so we don't save them in the DB directly if they don't belong
      const { sendEmail, sendToEmail, currentWorkFiles, completedWorkFiles, ...dbData } = reportData

      // 1. Upload files if any exist
      const currentWorkUrls = await this.uploadFiles(currentWorkFiles, 'current-work')
      const completedWorkUrls = await this.uploadFiles(completedWorkFiles, 'completed-work')

      // 2. Add URLs to the database data
      dbData.currentWorkAttachments = currentWorkUrls
      dbData.completedWorkAttachments = completedWorkUrls

      const { data, error } = await supabase
        .from('reports')
        .insert([dbData])
        .select()
        .single()
        
      if (error) throw error

      // Simulate sending email
      if (sendEmail && sendToEmail) {
        console.log(`[Email Service Mock] Sending report to: ${sendToEmail}`)
      }

      return data
    } catch (err) {
      console.error('Supabase Error in createReport:', err)
      console.warn('Supabase not configured or error occurred. Falling back to local storage.', err)
      const { sendEmail, sendToEmail, currentWorkFiles, completedWorkFiles, ...dbData } = reportData
      if (sendEmail && sendToEmail) {
        console.log(`[Email Service Mock] Sending mocked report to: ${sendToEmail}`)
      }
      
      // Use previews as URLs for mock persistence
      dbData.currentWorkAttachments = (currentWorkFiles || []).map(f => f.preview)
      dbData.completedWorkAttachments = (completedWorkFiles || []).map(f => f.preview)

      const newMock = { id: Date.now(), created_at: new Date().toISOString(), ...dbData }
      
      // Save to localStorage
      const existing = localStorage.getItem('mockedReports')
      const reportsList = existing ? JSON.parse(existing) : []
      reportsList.unshift(newMock)
      localStorage.setItem('mockedReports', JSON.stringify(reportsList))
      
      return newMock
    }
  },

  async uploadFiles(files, subPath) {
    if (!files || files.length === 0) return []

    const uploadPromises = files.map(async (fileData) => {
      const file = fileData.file
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${subPath}/${Date.now()}-${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('report-attachments')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return null
      }

      const { data } = supabase.storage
        .from('report-attachments')
        .getPublicUrl(filePath)

      return data.publicUrl
    })

    const results = await Promise.all(uploadPromises)
    return results.filter(url => url !== null)
  }
}
