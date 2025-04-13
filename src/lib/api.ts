// API utility functions for making backend requests

// Base URL for your Flask backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API error: ${response.status}`)
  }

  return response.json()
}

// Patient API functions
export const patientAPI = {
  // Add a new patient
  addPatient: (data: any) => {
    // Convert data to URL parameters as expected by Flask backend
    const params = new URLSearchParams()
    
    // Map form data to the expected parameter names
    params.append('fName', data.firstName)
    params.append('lName', data.lastName)
    params.append('bDate', data.dob)
    params.append('gender', data.gender)
    params.append('email', data.email || '')
    params.append('phoneNum', data.phone || '0')
    params.append('address', data.address || '')
    params.append('contactName', data.emergencyContact || '')
    params.append('contactPhone', data.emergencyPhone || '')
    params.append('diagnosis', data.diagnosisDate || '')
    params.append('severity', data.severity || '')
    params.append('medHist', data.medicalHistory || '')
    params.append('medication', data.currentMedications || '')
    
    return fetchAPI(`/add_patient?${params.toString()}`, {
      method: 'POST',
    })
  },
  
  // Add a note to a patient
  addNote: (patientId: string, note: string) => {
    const params = new URLSearchParams()
    params.append('id', patientId)
    params.append('note', note)
    
    return fetchAPI(`/add_note/?${params.toString()}`, {
      method: 'POST',
    })
  },
}

// Assessment API functions
export const assessmentAPI = {
  addAssessment: (data: any) => {
    const params = new URLSearchParams()
    params.append('date', data.date)
    params.append('type', data.type)
    params.append('path', data.path)
    params.append('baselinePath', data.baselinePath || '')
    
    return fetchAPI(`/add_assessment?${params.toString()}`, {
      method: 'POST',
    })
  },
}

// Treatment API functions
export const treatmentAPI = {
  addTreatment: (data: any) => {
    const params = new URLSearchParams()
    params.append('date', data.date)
    params.append('treatment', data.treatment)
    params.append('provider', data.provider)
    
    return fetchAPI(`/add_treatment?${params.toString()}`, {
      method: 'POST',
    })
  },
} 