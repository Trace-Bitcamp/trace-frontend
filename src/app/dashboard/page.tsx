import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ClipboardList, Users, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 w-full z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-10 flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {/* <Activity className="h-6 w-6 text-emerald-500" /> */}
            <span className="text-xl font-bold">trace</span>
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
          <Button variant="outline">Sign Out</Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="px-10 py-10">
          <div className="grid gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, Dr. Johnson</h1>
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
                  <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">5 scheduled today</p>
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
                  <div className="space-y-4">
                    {[
                      { name: "Sarah Miller", date: "Today", score: "Moderate", change: "Improved" },
                      { name: "Robert Chen", date: "Yesterday", score: "Mild", change: "Stable" },
                      { name: "Maria Garcia", date: "Apr 10", score: "Severe", change: "Declined" },
                      { name: "James Wilson", date: "Apr 8", score: "Moderate", change: "Improved" },
                    ].map((patient, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="font-medium">{patient.name}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">{patient.date}</div>
                          <div
                            className={`text-sm ${
                              patient.change === "Improved"
                                ? "text-emerald-500"
                                : patient.change === "Declined"
                                  ? "text-red-500"
                                  : "text-amber-500"
                            }`}
                          >
                            {patient.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Link href="/new-assessment">
                    <Button className="w-full">New Assessment</Button>
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
