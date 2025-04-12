import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Plus, Search } from "lucide-react"

export default function PatientsPage() {
  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Link href="/patients/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Patient
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Directory</CardTitle>
            <CardDescription>Manage and view all patients in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search patients..." className="pl-8" />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Diagnosis Date</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Last Assessment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "P-1001",
                      name: "Sarah Miller",
                      age: 68,
                      gender: "Female",
                      diagnosisDate: "Mar 15, 2020",
                      severity: "Moderate",
                      lastAssessment: "Today",
                      trend: "Improved",
                    },
                    {
                      id: "P-1002",
                      name: "Robert Chen",
                      age: 72,
                      gender: "Male",
                      diagnosisDate: "Jan 8, 2019",
                      severity: "Mild",
                      lastAssessment: "Yesterday",
                      trend: "Stable",
                    },
                    {
                      id: "P-1003",
                      name: "Maria Garcia",
                      age: 65,
                      gender: "Female",
                      diagnosisDate: "Nov 22, 2021",
                      severity: "Severe",
                      lastAssessment: "Apr 10, 2023",
                      trend: "Declined",
                    },
                    {
                      id: "P-1004",
                      name: "James Wilson",
                      age: 70,
                      gender: "Male",
                      diagnosisDate: "Feb 3, 2018",
                      severity: "Moderate",
                      lastAssessment: "Apr 8, 2023",
                      trend: "Improved",
                    },
                    {
                      id: "P-1005",
                      name: "Patricia Johnson",
                      age: 75,
                      gender: "Female",
                      diagnosisDate: "Sep 12, 2017",
                      severity: "Moderate",
                      lastAssessment: "Apr 5, 2023",
                      trend: "Stable",
                    },
                    {
                      id: "P-1006",
                      name: "Michael Brown",
                      age: 67,
                      gender: "Male",
                      diagnosisDate: "Jul 30, 2022",
                      severity: "Mild",
                      lastAssessment: "Apr 3, 2023",
                      trend: "Improved",
                    },
                    {
                      id: "P-1007",
                      name: "Linda Davis",
                      age: 71,
                      gender: "Female",
                      diagnosisDate: "Apr 18, 2020",
                      severity: "Severe",
                      lastAssessment: "Mar 28, 2023",
                      trend: "Declined",
                    },
                  ].map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.diagnosisDate}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            patient.severity === "Mild"
                              ? "bg-emerald-100 text-emerald-800"
                              : patient.severity === "Moderate"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {patient.severity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{patient.lastAssessment}</span>
                          <span
                            className={`text-xs ${
                              patient.trend === "Improved"
                                ? "text-emerald-500"
                                : patient.trend === "Declined"
                                  ? "text-red-500"
                                  : "text-amber-500"
                            }`}
                          >
                            {patient.trend}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/patients/${patient.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/assessments/new?patient=${patient.id}`}>
                            <Button size="sm">Assess</Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
