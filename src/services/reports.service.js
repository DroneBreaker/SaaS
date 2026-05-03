import { supabase } from '../lib/supabaseClient'

export const ReportsService = {
  async fetchReports() {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.warn('Supabase not configured or reports table missing. Returning empty array.', err)
      return []
    }
  },

  async createReport(reportData) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single()
        
      if (error) throw error
      return data
    } catch (err) {
      console.warn('Supabase not configured. Mocking response.', err)
      return { id: Date.now(), created_at: new Date().toISOString(), ...reportData }
    }
  }
}
