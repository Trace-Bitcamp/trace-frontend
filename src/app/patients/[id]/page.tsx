"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Clock, Send, User } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PatientData = {
  id: string;
  fName: string;
  lName: string;
  birthDate: string;
  age: number;
  gender: string;
  email: string;
  phoneNum: string;
  address: string;
  contactName: string;
  contactPhone: string;
  diagnosis: string;
  severity: string;
  medHist: string;
  medication: Array<{
    date: string;
    t_desc: string;
    provider: string;
  }>;
  assessment_ids: string[];
  notes: string[];
};

export default function PatientProfilePage() {
  const params = useParams()
  const patientId = params.id as string
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [aiMessage, setAiMessage] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [doctorNotes, setDoctorNotes] = useState<{ date: string; note: string; doctor: string }[]>([])
  const [isAddTreatmentOpen, setIsAddTreatmentOpen] = useState(false)
  const [treatmentDate, setTreatmentDate] = useState(new Date().toISOString().split("T")[0])
  const [treatmentDescription, setTreatmentDescription] = useState("")
  const [treatmentProvider, setTreatmentProvider] = useState("Dr. Johnson")
  const [patientAssessments, setPatientAssessments] = useState<any[]>([])

  useEffect(() => {
    const fetchAssessments = async (patientId: string) => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/assessments/${patientId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch assessments')
        }
        let data = await response.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch assessments')
        }
        // Transform the data to match the expected format
        const transformedData = data.data;
        // drop id, type, patient_id
        const filteredData = transformedData.map((assessment: any) => {
          const { id, type, patient_id, ...rest } = assessment;
          return rest;
        });
        setPatientAssessments(filteredData)
      } catch(error) {
        console.error('Error fetching assessments:', error)
      }
    }

    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/patient/${patientId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch patient')
        }
        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch patient')
        }
        setPatient(data.data)


        // Load saved notes from localStorage
        const savedNotes = localStorage.getItem(`patient-notes-history-${patientId}`)
        if (savedNotes) {
          setDoctorNotes(JSON.parse(savedNotes))
        } else {
          // Set some default notes for demo purposes
          const defaultNotes = [
            {
              date: "2023-04-01",
              note: "Patient reports increased tremor in the morning. Considering adjusting medication timing.",
              doctor: "Dr. Johnson",
            },
            {
              date: "2023-03-15",
              note: "Good response to physical therapy. Continuing current regimen.",
              doctor: "Dr. Williams",
            },
          ]
          setDoctorNotes(defaultNotes)
          localStorage.setItem(`patient-notes-history-${patientId}`, JSON.stringify(defaultNotes))
        }
      } catch (error) {
        console.error('Error fetching patient:', error)
      } finally {
        setLoading(false)
        fetchAssessments(patientId)
      }
    }

    

    if (patientId) {
      fetchPatient();
    }
  }, [patientId])

  const handleAddTreatment = async () => {
    if (!treatmentDescription.trim()) {
      console.log("enter treatment description")
      return
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/add_treatment?id=${patientId}&date=${treatmentDate}&t_desc=${encodeURIComponent(treatmentDescription)}&provider=${encodeURIComponent(treatmentProvider)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save treatment')
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to save treatment')
      }

      // Add the new treatment to the patient's treatments
      const updatedTreatments = [
        {
          date: treatmentDate,
          t_desc: treatmentDescription,
          provider: treatmentProvider
        },
        ...patient.medication,
      ]

      // Update the patient object
      setPatient({
        ...patient,
        medication: updatedTreatments,
      })

      // Reset form and close dialog
      setTreatmentDate(new Date().toISOString().split("T")[0])
      setTreatmentDescription("")
      setTreatmentProvider("Dr. Johnson")
      setIsAddTreatmentOpen(false)

      console.log("Treatment added successfully")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSendMessage = () => {
    if (!aiMessage.trim()) return

    setAiLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Based on the patient's history with ${aiMessage}, I recommend continuing the current treatment but increasing physical therapy to 3x weekly. Monitor for side effects and reassess in 2 weeks.`,
        `The patient's response to ${aiMessage} has been suboptimal. Consider adding a dopamine agonist like Pramipexole at a low dose (0.125mg daily) and gradually titrate up while monitoring for side effects.`,
        `${aiMessage} appears to be working well. Continue the current dosage and add a structured exercise program focusing on balance and coordination. Schedule a follow-up assessment in 1 month.`,
        `Given the patient's history and current symptoms, ${aiMessage} should be supplemented with occupational therapy. Also consider a sleep study as the patient may have REM sleep behavior disorder affecting overall symptom management.`,
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setAiResponse(randomResponse)
      setAiLoading(false)
    }, 1500)
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      const response = await fetch(`http://127.0.0.1:5000/add_note?id=${patientId}&note=${encodeURIComponent(newNote)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save note')
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to save note')
      }

      // Refresh patient data to get updated notes
      const patientResponse = await fetch(`http://127.0.0.1:5000/patient/${patientId}`)
      if (!patientResponse.ok) {
        throw new Error('Failed to fetch updated patient data')
      }
      const patientData = await patientResponse.json()
      if (!patientData.success) {
        throw new Error(patientData.error || 'Failed to fetch updated patient data')
      }
      setPatient(patientData.data)

      setNewNote("")
      console.log("Note added successfully")
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  if (loading) {
    return (
      <div className="px-10 py-10">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-[250px] bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-[200px] bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="px-10 py-10">
        <Link href="/patients" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Link>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Patient Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The patient you're looking for doesn't exist or you don't have access.
          </p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-10 py-10">
      <Link href="/patients" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Patients
      </Link>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{patient.fName} {patient.lName}</h1>
              <p className="text-muted-foreground">
                Patient ID: {patient.id} • {patient.gender}, {patient.age} years old
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => (window.location.href = `/new-assessment?patientId=${patient.id}`)}>
              New Assessment
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p>{patient.birthDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Diagnosis Date</p>
                  <p>{patient.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Severity</p>
                  <p
                    className={`font-medium ${
                      patient.severity === "Mild"
                        ? "text-emerald-500"
                        : patient.severity === "Moderate"
                          ? "text-amber-500"
                          : "text-red-500"
                    }`}
                  >
                    {patient.severity}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trend</p>
                  <p
                    className={`font-medium ${
                      patient.trend === "Improved"
                        ? "text-emerald-500"
                        : patient.trend === "Declined"
                          ? "text-red-500"
                          : "text-amber-500"
                    }`}
                  >
                    {patient.trend}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                <div className="space-y-2 mt-2">
                  <p className="text-sm">Phone: {patient.phoneNum}</p>
                  <p className="text-sm">Email: {patient.email}</p>
                  <p className="text-sm">Address: {patient.address}</p>
                  <p className="text-sm font-medium mt-2">Emergency Contact:</p>
                  <p className="text-sm">{patient.contactName} - {patient.contactPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>PD Progression</CardTitle>
              <CardDescription>Tracking symptoms over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientAssessments} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="severity" stroke="#ef4444" name="Severity Score" />
                    <Line type="monotone" dataKey="tremor" stroke="#10b981" name="Tremor" />
                    <Line type="monotone" dataKey="deviation" stroke="#3b82f6" name="Average Deviation" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Severity Score</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-sm">Tremor</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Deviation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="treatments">
          <TabsList className="mb-4">
            <TabsTrigger value="treatments">Treatment History</TabsTrigger>
            <TabsTrigger value="notes">Doctor's Notes</TabsTrigger>
            <TabsTrigger value="ai">AI Consultation</TabsTrigger>
          </TabsList>

          <TabsContent value="treatments">
            <Card>
              <CardHeader>
                <CardTitle>Treatment History</CardTitle>
                <CardDescription>Past and current treatments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {patient.medication && patient.medication.length > 0 ? (
                    patient.medication.map((treatment: { date: string; t_desc: string; provider: string }, index: number) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center">
                            <p className="font-medium">{treatment.t_desc}</p>
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                              {treatment.date}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">Provider: {treatment.provider}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Calendar className="h-8 w-8 mb-2" />
                      <p className="text-sm">No treatments recorded yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setIsAddTreatmentOpen(true)}>
                  Add New Treatment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Doctor's Notes</CardTitle>
                <CardDescription>Clinical observations and notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="new-note" className="text-sm font-medium">
                      Add New Note
                    </label>
                    <Textarea
                      id="new-note"
                      placeholder="Enter your clinical observations, treatment plans, and follow-up notes here..."
                      className="min-h-[100px]"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button onClick={handleAddNote} className="mt-2">
                      Save Note
                    </Button>
                  </div>

                  <div className="space-y-6 mt-6">
                    <h3 className="text-lg font-medium">Previous Notes</h3>
                    {patient.notes && patient.notes.length > 0 ? (
                      patient.notes.map((note: { date: string; note: string; doctor: string }, index: number) => (
                        <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{note.date}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{note.doctor}</span>
                          </div>
                          <p className="text-sm">{note.note}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mb-2" />
                        <p className="text-sm">No notes recorded yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Treatment Consultation</CardTitle>
                <CardDescription>Get AI-powered treatment recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Enter current treatments and symptoms</p>
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="e.g., Patient is currently on Levodopa 100mg 3x daily and experiencing morning tremors..."
                        className="min-h-[80px] flex-1"
                        value={aiMessage}
                        onChange={(e) => setAiMessage(e.target.value)}
                      />
                      <Button className="self-end" onClick={handleSendMessage} disabled={aiLoading}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {aiLoading && (
                  <div className="flex items-center justify-center p-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                    <span className="ml-2">Analyzing patient data...</span>
                  </div>
                )}

                {aiResponse && !aiLoading && (
                  <div className="rounded-lg border bg-primary/5 p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-primary"
                        >
                          <path d="M12 8V4H8" />
                          <rect width="16" height="12" x="4" y="8" rx="2" />
                          <path d="M2 14h2" />
                          <path d="M20 14h2" />
                          <path d="M15 13v2" />
                          <path d="M9 13v2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">AI Treatment Recommendation</p>
                      </div>
                    </div>
                    <p className="text-sm">{aiResponse}</p>
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p>
                        Note: This is an AI-generated recommendation based on the information provided. Always use
                        clinical judgment and consult with specialists when appropriate.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Treatment Dialog */}
        <Dialog open={isAddTreatmentOpen} onOpenChange={setIsAddTreatmentOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Treatment</DialogTitle>
              <DialogDescription>Enter the details of the new treatment for {patient.fName} {patient.lName}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="treatment-date">Date</Label>
                <Input
                  id="treatment-date"
                  type="date"
                  value={treatmentDate}
                  onChange={(e) => setTreatmentDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="treatment-description">Treatment Description</Label>
                <Textarea
                  id="treatment-description"
                  placeholder="Enter medication, therapy, or procedure details..."
                  value={treatmentDescription}
                  onChange={(e) => setTreatmentDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="treatment-provider">Provider</Label>
                <Input
                  id="treatment-provider"
                  placeholder="Enter provider name"
                  value={treatmentProvider}
                  onChange={(e) => setTreatmentProvider(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTreatmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTreatment}>Save Treatment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
