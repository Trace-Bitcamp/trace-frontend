"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Clock, Send, User } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
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
  name: string;
  dob: string;
  age: number;
  gender: string;
  diagnosisDate: string;
  severity: string;
  lastAssessment: string;
  trend: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    emergency: string;
  };
  treatments: Array<{
    date: string;
    treatment: string;
    provider: string;
  }>;
  progressData: Array<{
    month: string;
    tremor: number;
    mobility: number;
    overall: number;
  }>;
};

// Mock patient data
const patientsData: Record<string, PatientData> = {
  "P-1001": {
    id: "P-1001",
    name: "Sarah Miller",
    dob: "1955-08-12",
    age: 68,
    gender: "Female",
    diagnosisDate: "Mar 15, 2020",
    severity: "Moderate",
    lastAssessment: "Today",
    trend: "Improved",
    contact: {
      phone: "(555) 123-4567",
      email: "sarah.miller@example.com",
      address: "123 Main St, Anytown, CA 94321",
      emergency: "John Miller (Husband) - (555) 123-4568",
    },
    treatments: [
      { date: "2023-04-01", treatment: "Levodopa 100mg 3x daily", provider: "Dr. Johnson" },
      { date: "2023-02-15", treatment: "Physical Therapy - 2x weekly", provider: "Dr. Williams" },
      { date: "2022-11-10", treatment: "Levodopa 50mg 3x daily", provider: "Dr. Johnson" },
      { date: "2022-08-05", treatment: "Initial medication - Sinemet 25/100mg", provider: "Dr. Johnson" },
    ],
    progressData: [
      { month: "Sep", tremor: 65, mobility: 45, overall: 55 },
      { month: "Oct", tremor: 60, mobility: 48, overall: 52 },
      { month: "Nov", tremor: 58, mobility: 50, overall: 50 },
      { month: "Dec", tremor: 55, mobility: 53, overall: 48 },
      { month: "Jan", tremor: 50, mobility: 55, overall: 45 },
      { month: "Feb", tremor: 48, mobility: 58, overall: 42 },
      { month: "Mar", tremor: 45, mobility: 60, overall: 40 },
      { month: "Apr", tremor: 42, mobility: 63, overall: 38 },
    ],
  },
  "P-1002": {
    id: "P-1002",
    name: "Robert Chen",
    dob: "1951-03-24",
    age: 72,
    gender: "Male",
    diagnosisDate: "Jan 8, 2019",
    severity: "Mild",
    lastAssessment: "Yesterday",
    trend: "Stable",
    contact: {
      phone: "(555) 234-5678",
      email: "robert.chen@example.com",
      address: "456 Oak Ave, Anytown, CA 94322",
      emergency: "Mary Chen (Wife) - (555) 234-5679",
    },
    treatments: [
      { date: "2023-04-10", treatment: "Ropinirole 1mg daily", provider: "Dr. Johnson" },
      { date: "2023-01-20", treatment: "Occupational Therapy - 1x weekly", provider: "Dr. Smith" },
      { date: "2022-09-15", treatment: "Ropinirole 0.5mg daily", provider: "Dr. Johnson" },
      { date: "2022-05-12", treatment: "Initial medication - Requip 0.25mg", provider: "Dr. Johnson" },
    ],
    progressData: [
      { month: "Sep", tremor: 35, mobility: 65, overall: 40 },
      { month: "Oct", tremor: 33, mobility: 68, overall: 38 },
      { month: "Nov", tremor: 32, mobility: 70, overall: 37 },
      { month: "Dec", tremor: 30, mobility: 72, overall: 35 },
      { month: "Jan", tremor: 30, mobility: 72, overall: 35 },
      { month: "Feb", tremor: 31, mobility: 71, overall: 36 },
      { month: "Mar", tremor: 30, mobility: 72, overall: 35 },
      { month: "Apr", tremor: 29, mobility: 73, overall: 34 },
    ],
  },
  "P-1003": {
    id: "P-1003",
    name: "Maria Garcia",
    dob: "1958-11-30",
    age: 65,
    gender: "Female",
    diagnosisDate: "Nov 22, 2021",
    severity: "Severe",
    lastAssessment: "Apr 10, 2023",
    trend: "Declined",
    contact: {
      phone: "(555) 345-6789",
      email: "maria.garcia@example.com",
      address: "789 Pine St, Anytown, CA 94323",
      emergency: "Carlos Garcia (Son) - (555) 345-6780",
    },
    treatments: [
      { date: "2023-04-05", treatment: "Levodopa/Carbidopa 25/100mg 4x daily", provider: "Dr. Johnson" },
      { date: "2023-03-01", treatment: "Deep Brain Stimulation evaluation", provider: "Dr. Martinez" },
      { date: "2023-01-15", treatment: "Levodopa/Carbidopa 25/100mg 3x daily", provider: "Dr. Johnson" },
      { date: "2022-11-22", treatment: "Initial medication - Sinemet 25/100mg 2x daily", provider: "Dr. Johnson" },
    ],
    progressData: [
      { month: "Nov", tremor: 70, mobility: 40, overall: 65 },
      { month: "Dec", tremor: 72, mobility: 38, overall: 68 },
      { month: "Jan", tremor: 75, mobility: 35, overall: 70 },
      { month: "Feb", tremor: 78, mobility: 32, overall: 73 },
      { month: "Mar", tremor: 80, mobility: 30, overall: 75 },
      { month: "Apr", tremor: 82, mobility: 28, overall: 78 },
    ],
  },
  "P-1004": {
    id: "P-1004",
    name: "James Wilson",
    dob: "1953-06-18",
    age: 70,
    gender: "Male",
    diagnosisDate: "Feb 3, 2018",
    severity: "Moderate",
    lastAssessment: "Apr 8, 2023",
    trend: "Improved",
    contact: {
      phone: "(555) 456-7890",
      email: "james.wilson@example.com",
      address: "101 Maple Dr, Anytown, CA 94324",
      emergency: "Susan Wilson (Wife) - (555) 456-7891",
    },
    treatments: [
      { date: "2023-04-08", treatment: "Amantadine 100mg 2x daily", provider: "Dr. Johnson" },
      { date: "2023-02-20", treatment: "Physical Therapy - 2x weekly", provider: "Dr. Williams" },
      { date: "2022-12-10", treatment: "Amantadine 100mg daily", provider: "Dr. Johnson" },
      { date: "2022-09-15", treatment: "Levodopa/Carbidopa 25/100mg 3x daily", provider: "Dr. Johnson" },
    ],
    progressData: [
      { month: "Sep", tremor: 60, mobility: 50, overall: 55 },
      { month: "Oct", tremor: 58, mobility: 52, overall: 53 },
      { month: "Nov", tremor: 55, mobility: 55, overall: 50 },
      { month: "Dec", tremor: 52, mobility: 58, overall: 48 },
      { month: "Jan", tremor: 50, mobility: 60, overall: 45 },
      { month: "Feb", tremor: 48, mobility: 63, overall: 42 },
      { month: "Mar", tremor: 45, mobility: 65, overall: 40 },
      { month: "Apr", tremor: 42, mobility: 68, overall: 38 },
    ],
  },
  "P-1005": {
    id: "P-1005",
    name: "Patricia Johnson",
    dob: "1948-09-05",
    age: 75,
    gender: "Female",
    diagnosisDate: "Sep 12, 2017",
    severity: "Moderate",
    lastAssessment: "Apr 5, 2023",
    trend: "Stable",
    contact: {
      phone: "(555) 567-8901",
      email: "patricia.johnson@example.com",
      address: "202 Cedar Ln, Anytown, CA 94325",
      emergency: "Michael Johnson (Son) - (555) 567-8902",
    },
    treatments: [
      { date: "2023-04-05", treatment: "Levodopa/Carbidopa 25/100mg 3x daily", provider: "Dr. Johnson" },
      { date: "2023-01-15", treatment: "Occupational Therapy - 1x weekly", provider: "Dr. Smith" },
      { date: "2022-10-20", treatment: "Levodopa/Carbidopa 25/100mg 2x daily", provider: "Dr. Johnson" },
      { date: "2022-07-10", treatment: "Initial medication - Sinemet 25/100mg", provider: "Dr. Johnson" },
    ],
    progressData: [
      { month: "Sep", tremor: 55, mobility: 50, overall: 52 },
      { month: "Oct", tremor: 54, mobility: 51, overall: 51 },
      { month: "Nov", tremor: 55, mobility: 50, overall: 52 },
      { month: "Dec", tremor: 53, mobility: 52, overall: 50 },
      { month: "Jan", tremor: 54, mobility: 51, overall: 51 },
      { month: "Feb", tremor: 55, mobility: 50, overall: 52 },
      { month: "Mar", tremor: 54, mobility: 51, overall: 51 },
      { month: "Apr", tremor: 53, mobility: 52, overall: 50 },
    ],
  },
  "P-1006": {
    id: "P-1006",
    name: "Michael Brown",
    dob: "1956-12-15",
    age: 67,
    gender: "Male",
    diagnosisDate: "Jul 30, 2022",
    severity: "Mild",
    lastAssessment: "Apr 3, 2023",
    trend: "Improved",
    contact: {
      phone: "(555) 678-9012",
      email: "michael.brown@example.com",
      address: "303 Birch St, Anytown, CA 94326",
      emergency: "Jennifer Brown (Daughter) - (555) 678-9013",
    },
    treatments: [
      { date: "2023-04-03", treatment: "Pramipexole 0.5mg daily", provider: "Dr. Johnson" },
      { date: "2023-02-10", treatment: "Physical Therapy - 1x weekly", provider: "Dr. Williams" },
      { date: "2022-12-05", treatment: "Pramipexole 0.25mg daily", provider: "Dr. Johnson" },
      { date: "2022-07-30", treatment: "Initial evaluation", provider: "Dr. Johnson" },
    ],
    progressData: [
      { month: "Sep", tremor: 30, mobility: 75, overall: 35 },
      { month: "Oct", tremor: 28, mobility: 77, overall: 33 },
      { month: "Nov", tremor: 27, mobility: 78, overall: 32 },
      { month: "Dec", tremor: 25, mobility: 80, overall: 30 },
      { month: "Jan", tremor: 23, mobility: 82, overall: 28 },
      { month: "Feb", tremor: 22, mobility: 83, overall: 27 },
      { month: "Mar", tremor: 20, mobility: 85, overall: 25 },
      { month: "Apr", tremor: 18, mobility: 87, overall: 23 },
    ],
  },
  "P-1007": {
    id: "P-1007",
    name: "Linda Davis",
    dob: "1952-04-22",
    age: 71,
    gender: "Female",
    diagnosisDate: "Apr 18, 2020",
    severity: "Severe",
    lastAssessment: "Mar 28, 2023",
    trend: "Declined",
    contact: {
      phone: "(555) 789-0123",
      email: "linda.davis@example.com",
      address: "404 Elm Ct, Anytown, CA 94327",
      emergency: "Robert Davis (Husband) - (555) 789-0124",
    },
    treatments: [
      { date: "2023-03-28", treatment: "Levodopa/Carbidopa/Entacapone 25/100/200mg 4x daily", provider: "Dr. Johnson" },
      { date: "2023-02-15", treatment: "Deep Brain Stimulation consultation", provider: "Dr. Martinez" },
      { date: "2023-01-10", treatment: "Levodopa/Carbidopa 25/100mg 4x daily", provider: "Dr. Johnson" },
      { date: "2022-11-05", treatment: "Levodopa/Carbidopa 25/100mg 3x daily", provider: "Dr. Johnson" },
    ],
    progressData: [
      { month: "Sep", tremor: 75, mobility: 35, overall: 70 },
      { month: "Oct", tremor: 77, mobility: 33, overall: 72 },
      { month: "Nov", tremor: 78, mobility: 32, overall: 73 },
      { month: "Dec", tremor: 80, mobility: 30, overall: 75 },
      { month: "Jan", tremor: 82, mobility: 28, overall: 77 },
      { month: "Feb", tremor: 83, mobility: 27, overall: 78 },
      { month: "Mar", tremor: 85, mobility: 25, overall: 80 },
    ],
  },
}

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

  const handleAddTreatment = async () => {
    if (!treatmentDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a treatment description",
        type: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/treatments?date=${treatmentDate}&t_desc=${encodeURIComponent(treatmentDescription)}&provider=${encodeURIComponent(treatmentProvider)}`);

      if (!response.ok) {
        throw new Error('Failed to save treatment')
      }

      const savedTreatment = await response.json()

      // Add the new treatment to the patient's treatments
      const updatedTreatments = [
        savedTreatment,
        ...patient.treatments,
      ]

      // Update the patient object
      setPatient({
        ...patient,
        treatments: updatedTreatments,
      })

      // Reset form and close dialog
      setTreatmentDate(new Date().toISOString().split("T")[0])
      setTreatmentDescription("")
      setTreatmentProvider("Dr. Johnson")
      setIsAddTreatmentOpen(false)

      toast({
        title: "Treatment added",
        description: "The new treatment has been added to the patient's record.",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save treatment. Please try again.",
        type: "destructive",
      })
    }
  }

  useEffect(() => {
    // In a real app, this would be an API call
    if (patientId && patientsData[patientId]) {
      setPatient(patientsData[patientId])

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
    }
    setLoading(false)
  }, [patientId])

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

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const currentDate = new Date().toISOString().split("T")[0]
    const newNoteObj = {
      date: currentDate,
      note: newNote,
      doctor: "Dr. Johnson", // In a real app, this would be the logged-in doctor
    }

    const updatedNotes = [newNoteObj, ...doctorNotes]
    setDoctorNotes(updatedNotes)
    localStorage.setItem(`patient-notes-history-${patientId}`, JSON.stringify(updatedNotes))

    setNewNote("")
    toast({
      title: "Note added",
      description: "Your clinical note has been saved successfully.",
      type: "success",
    })
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
              <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
              <p className="text-muted-foreground">
                Patient ID: {patient.id} • {patient.gender}, {patient.age} years old
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => (window.location.href = `/new-assessment?patient=${patient.id}`)}>
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
                  <p>{patient.dob}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Diagnosis Date</p>
                  <p>{patient.diagnosisDate}</p>
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
                  <p className="text-sm">Phone: {patient.contact.phone}</p>
                  <p className="text-sm">Email: {patient.contact.email}</p>
                  <p className="text-sm">Address: {patient.contact.address}</p>
                  <p className="text-sm font-medium mt-2">Emergency Contact:</p>
                  <p className="text-sm">{patient.contact.emergency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Disease Progression</CardTitle>
              <CardDescription>Tracking symptoms over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patient.progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="tremor" stroke="#ef4444" name="Tremor Severity" />
                    <Line type="monotone" dataKey="mobility" stroke="#10b981" name="Mobility Score" />
                    <Line type="monotone" dataKey="overall" stroke="#3b82f6" name="Overall Severity" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Tremor (lower is better)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-sm">Mobility (higher is better)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Overall Severity (lower is better)</span>
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
                  {patient.treatments.map((treatment: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        {index < patient.treatments.length - 1 && <div className="h-full w-px bg-border" />}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center">
                          <p className="font-medium">{treatment.treatment}</p>
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {treatment.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Provider: {treatment.provider}</p>
                      </div>
                    </div>
                  ))}
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
                    {doctorNotes.map((note, index) => (
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
                    ))}
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
              <DialogDescription>Enter the details of the new treatment for {patient.name}.</DialogDescription>
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
