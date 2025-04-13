"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ClipboardList, Users, FileText } from "lucide-react"

interface RecentPatient {
  id: string
  fName: string
  lName: string
  date: string
}

export default function Home() {
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentAssessments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/recent-assessments')
        if (!response.ok) {
          throw new Error('Failed to fetch recent assessments')
        }
        const data = await response.json()
        if (data.success) {
          setRecentPatients(data.data.map((item: any) => item.patient))
        }
      } catch (error) {
        console.error('Error fetching recent assessments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentAssessments()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 w-full z-10 border-b bg-background/10 backdrop-blur supports-[backdrop-filter]:bg-background/10 bg-opacity-10  drop-shadow-lg">
        <div className="w-full px-10 flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {/* <Activity className="h-6 w-6 text-emerald-500" /> */}
            <span className="text-2xl font-serif tracking-tighter italic font-light text-purple-700">Trace.</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/patients" className="text-sm font-medium text-muted-foreground">
              Patients
            </Link>
            <Link href="/new-assessment" className="text-sm font-medium text-muted-foreground">
              New Assessment
            </Link>
          </nav>
          <Button className="bg-gradient-to-t from-purple-800 to-purple-600 text-purple-100">Sign Out</Button>
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-tl from-purple-200 to-purple-100">
        <section className="px-10 py-10">
          <div className="grid gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-purple-800 tracking-tight">Welcome back, Dr. Johnson</h1>
              <p className="text-muted-foreground">
                Monitor your patients' Parkinson's disease progression and treatment efficacy
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+2 this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Improved Cases</CardTitle>
                  <Activity className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>Your recently assessed patients</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        </div>
                      ))}
                    </div>
                  ) : recentPatients.length > 0 ? (
                    <div className="space-y-4">
                      {recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="font-medium">
                              {patient.fName} {patient.lName}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                              {formatDate(patient.date)}
                            </div>
                            <Link href={`/patients/${patient.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No recent assessments found
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Link href="/new-assessment">
                    <Button className="w-full bg-gradient-to-tr from-purple-900 to-purple-600 text-purple-100">New Assessment</Button>
                  </Link>
                  <Link href="/patients/new">
                    <Button variant="outline" className="w-full">
                      Add New Patient
                    </Button>
                  </Link>
                  <Link href="/patients">
                    <Button variant="outline" className="w-full">
                    View All Patients
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
