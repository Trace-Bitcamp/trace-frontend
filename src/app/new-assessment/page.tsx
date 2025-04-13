"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, ArrowLeft, Download, Save } from "lucide-react"
import { useRouter } from "next/router";

export default function NewAssessment() {
  const canvasRefTemplate = useRef<HTMLCanvasElement | null>(null)
  const canvasRefDrawings = useRef<HTMLCanvasElement | null>(null)
  const [ctxTemplate, setCtxTemplate] = useState<CanvasRenderingContext2D | null>(null)
  const [ctxDrawings, setCtxDrawings] = useState<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 })
  const [patientName, setPatientName] = useState("")
  const [patientId, setPatientId] = useState("")
  const [assessmentType, setAssessmentType] = useState("spiral")
  const [points, setPoints] = useState<{ x: number; y: number; time: number }[]>([])
  const [metrics, setMetrics] = useState({
    tremor: 0,
    deviation: 0,
    speed: 0,
    pressure: 0,
    overall: 0,
  })
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (canvasRefTemplate.current) {
      const canvas = canvasRefTemplate.current
      const context = canvas.getContext("2d")

      // Set canvas dimensions
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      if (context) {
        context.lineJoin = "round"
        context.lineCap = "round"
        context.lineWidth = 2
        context.strokeStyle = "#000000"
        setCtxTemplate(context)

        // Draw template based on assessment type
        drawTemplate(context, assessmentType, canvas.width, canvas.height)
      }
    }
    if (canvasRefDrawings.current) {
      const canvas = canvasRefDrawings.current
      const context = canvas.getContext("2d")

      // Set canvas dimensions
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      if (context) {
        context.lineJoin = "round"
        context.lineCap = "round"
        context.lineWidth = 2
        context.strokeStyle = "#000000"
        setCtxDrawings(context)
      }
    }
  }, [canvasRefTemplate, canvasRefDrawings, assessmentType])

  const drawTemplate = (context: CanvasRenderingContext2D, type: string, width: number, height: number) => {
    context.clearRect(0, 0, width, height)
    context.strokeStyle = "#cccccc"
    context.lineWidth = 1

    if (type === "spiral") {
      // Draw spiral template
      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = Math.min(width, height) / 2 - 100 // Adjusted to make the spiral tighter

      context.beginPath()
      for (let i = 0; i < 720; i++) {
        const angle = 1.2 * i * (Math.PI / 180)
        const radius = (maxRadius / 720) * i
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }
      context.stroke()
    } else if (type === "meander") {
      // Draw square spiral template
      const centerX = width / 2;
      const centerY = height / 2;
      let sideLength = 100; // Initial side length
      let x = centerX; // Start at the center
      let y = centerY; // Start at the center
      const turns = 2;

      context.beginPath();
      context.moveTo(x, y);
      // move right
      x += sideLength / 2;
      context.lineTo(x, y);
      // move down
      y += sideLength / 2;
      context.lineTo(x, y);
      for(let i = 0; i < turns; i++) {
        // move left
        x -= sideLength;
        context.lineTo(x, y);
        // move up
        y -= sideLength;
        context.lineTo(x, y);

        sideLength += 100; // Increase side length for next turn

        // move right
        x += sideLength;
        context.lineTo(x, y);
        // move down
        y += sideLength;
        context.lineTo(x, y);

        sideLength += 100; // Increase side length for next turn
      }
      context.stroke();
    } else if (type === "text") {
      // Draw text template
      context.font = "24px Arial"
      context.fillStyle = "#cccccc"
      context.textAlign = "center"
      context.fillText("Trace this sentence", width / 2, height / 2)
    } else if (type === "line") {
      // Draw straight line template
      context.beginPath()
      context.moveTo(50, height / 2)
      context.lineTo(width - 50, height / 2)
      context.stroke()
    }

    // Reset stroke style for user drawing
    context.strokeStyle = "#000000"
    context.lineWidth = 2
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctxDrawings) return;

    setIsDrawing(true);

    // Get coordinates
    const coords = getCoordinates(e);
    setLastPoint({ x: coords.x, y: coords.y });

    // Start new path for template canvas
    ctxDrawings.beginPath();
    ctxDrawings.moveTo(coords.x, coords.y);

    // Record point with timestamp
    setPoints([...points, { x: coords.x, y: coords.y, time: Date.now() }]);
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxDrawings) return;

    // Prevent scrolling on touch devices
    e.preventDefault();

    // Get coordinates
    const coords = getCoordinates(e);

    // Draw line on the template canvas (black)
    ctxDrawings.lineTo(coords.x, coords.y);
    ctxDrawings.stroke();

    // Record point with timestamp
    setPoints([...points, { x: coords.x, y: coords.y, time: Date.now() }]);

    // Update last point
    setLastPoint({ x: coords.x, y: coords.y });
  }

  const stopDrawing = () => {
    if (!isDrawing || !ctxDrawings) return;

    setIsDrawing(false);
    ctxDrawings.closePath();
  }

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRefDrawings.current) return { x: 0, y: 0 }

    const canvas = canvasRefDrawings.current
    const rect = canvas.getBoundingClientRect()

    // Handle both mouse and touch events
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const calculateMetrics = () => {
    exportBothCanvases();
    // This is a simplified example of metrics calculation
    // In a real application, these would be more sophisticated algorithms

    // Calculate tremor (variation in adjacent points)
    let tremorSum = 0
    for (let i = 2; i < points.length; i++) {
      const p1 = points[i - 2]
      const p2 = points[i - 1]
      const p3 = points[i]

      // Calculate angle changes as a measure of tremor
      const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x)
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x)
      const angleDiff = Math.abs(angle2 - angle1)

      tremorSum += angleDiff
    }
    const tremorScore = Math.min(100, (tremorSum / points.length) * 100)

    // Calculate speed (time taken to complete)
    const timeElapsed = points[points.length - 1].time - points[0].time
    const speedScore = Math.min(100, (5000 / timeElapsed) * 100)

    // Calculate deviation (from template - simplified)
    const deviationScore = Math.random() * 40 + 30 // Placeholder

    // Calculate pressure (placeholder - would use pressure API in real app)
    const pressureScore = Math.random() * 40 + 30 // Placeholder

    // Overall score (weighted average)
    const overall = tremorScore * 0.4 + deviationScore * 0.3 + speedScore * 0.2 + pressureScore * 0.1

    setMetrics({
      tremor: Math.round(tremorScore),
      deviation: Math.round(deviationScore),
      speed: Math.round(speedScore),
      pressure: Math.round(pressureScore),
      overall: Math.round(overall),
    })

    setCompleted(true)
  }

  const resetCanvas = () => {
    if (!ctxTemplate || !ctxDrawings || !canvasRefTemplate.current || !canvasRefDrawings.current) return;

    // Clear the template canvas
    ctxTemplate.clearRect(0, 0, canvasRefTemplate.current.width, canvasRefTemplate.current.height);
    drawTemplate(ctxTemplate, assessmentType, canvasRefTemplate.current.width, canvasRefTemplate.current.height);

    // Clear the drawings canvas
    ctxDrawings.clearRect(0, 0, canvasRefDrawings.current.width, canvasRefDrawings.current.height);


    // Reset points and metrics
    setPoints([]);
    setCompleted(false);
    setMetrics({
        tremor: 0,
        deviation: 0,
        speed: 0,
        pressure: 0,
        overall: 0,
    });
  }

  const handleAssessmentTypeChange = (value: string) => {
    setAssessmentType(value)
    resetCanvas()
  }

  const getSeverityLabel = (score: number) => {
    if (score < 30) return "Mild"
    if (score < 60) return "Moderate"
    return "Severe"
  }

  const getSeverityColor = (score: number) => {
    if (score < 30) return "text-emerald-500"
    if (score < 60) return "text-amber-500"
    return "text-red-500"
  }

  const uploadImageToServer = async (traceData: string, templateData: string, age: number) => {
    const response = await fetch('http://127.0.0.1:5000/submit-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ trace: traceData, template: templateData, age: age }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Failed to upload image' + errorText);
    }

    const result = await response.json();
    console.log('Image uploaded successfully:', result);
  };

  const exportBothCanvases = async () => {
    if (!canvasRefTemplate.current || !canvasRefDrawings.current) return;
    
    const templateCanvas = canvasRefTemplate.current;
    const drawingsCanvas = canvasRefDrawings.current;
    
    const templateImageURL = templateCanvas.toDataURL("image/png");
    const drawingsImageURL = drawingsCanvas.toDataURL("image/png");
    const age = 0;
    
    // Upload images to the server
    await uploadImageToServer(drawingsImageURL, templateImageURL, age);

  };

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
          <h1 className="text-3xl font-bold tracking-tight">New Assessment</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetCanvas}>
              Reset
            </Button>
            <Button disabled={!completed}>Save Assessment</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Enter patient details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input
                  id="patient-id"
                  placeholder="Enter patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input
                  id="patient-name"
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessment-type">Assessment Type</Label>
                <Select value={assessmentType} onValueChange={handleAssessmentTypeChange}>
                  <SelectTrigger id="assessment-type">
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spiral">Spiral Tracing</SelectItem>
                    <SelectItem value="meander">Meander Tracing</SelectItem>
                    <SelectItem value="text">Text Tracing</SelectItem>
                    <SelectItem value="line">Straight Line</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Tracing Assessment</CardTitle>
              <CardDescription>
                {assessmentType === "spiral" && "Ask the patient to trace over the spiral pattern"}
                {assessmentType === "text" && "Ask the patient to trace over the text"}
                {assessmentType === "line" && "Ask the patient to trace over the straight line"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border">
                <canvas
                  ref={canvasRefTemplate}
                  className="h-full w-full touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />

                <canvas
                  ref={canvasRefDrawings}
                  className="absolute top-0 left-0 h-full w-full touch-none"
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetCanvas}>
                Clear
              </Button>
              <Button onClick={calculateMetrics} disabled={points.length < 10}>
                Analyze Results
              </Button>
            </CardFooter>
          </Card>
        </div>

        {completed && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-emerald-500" />
                Assessment Results
              </CardTitle>
              <CardDescription>Analysis of the patient's motor control</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics">
                <TabsList className="mb-4">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="metrics">
                  <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Severity</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${getSeverityColor(metrics.overall)}`}>
                          {getSeverityLabel(metrics.overall)}
                        </div>
                        <p className="text-xs text-muted-foreground">{metrics.overall}/100</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Tremor</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${getSeverityColor(metrics.tremor)}`}>
                          {getSeverityLabel(metrics.tremor)}
                        </div>
                        <p className="text-xs text-muted-foreground">{metrics.tremor}/100</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Deviation</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${getSeverityColor(metrics.deviation)}`}>
                          {getSeverityLabel(metrics.deviation)}
                        </div>
                        <p className="text-xs text-muted-foreground">{metrics.deviation}/100</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Speed</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${getSeverityColor(metrics.speed)}`}>
                          {getSeverityLabel(metrics.speed)}
                        </div>
                        <p className="text-xs text-muted-foreground">{metrics.speed}/100</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Pressure</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${getSeverityColor(metrics.pressure)}`}>
                          {getSeverityLabel(metrics.pressure)}
                        </div>
                        <p className="text-xs text-muted-foreground">{metrics.pressure}/100</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="analysis">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-lg font-semibold">Clinical Interpretation</h3>
                      <p className="mb-4">
                        Based on the assessment results, the patient shows{" "}
                        {getSeverityLabel(metrics.overall).toLowerCase()}
                        symptoms of Parkinson's disease. The primary indicators are:
                      </p>
                      <ul className="mb-4 list-disc pl-6 space-y-2">
                        <li>
                          <span className="font-medium">Tremor: </span>
                          {metrics.tremor < 30
                            ? "Minimal resting tremor observed during the tracing task."
                            : metrics.tremor < 60
                              ? "Moderate tremor affecting fine motor control."
                              : "Significant tremor affecting the patient's ability to complete the tracing task."}
                        </li>
                        <li>
                          <span className="font-medium">Movement Precision: </span>
                          {metrics.deviation < 30
                            ? "Good ability to follow the template pattern."
                            : metrics.deviation < 60
                              ? "Moderate difficulty maintaining precision in tracing."
                              : "Significant deviation from the template pattern."}
                        </li>
                        <li>
                          <span className="font-medium">Movement Speed: </span>
                          {metrics.speed < 30
                            ? "Normal movement speed with good control."
                            : metrics.speed < 60
                              ? "Some bradykinesia (slowness of movement) observed."
                              : "Marked bradykinesia affecting task completion time."}
                        </li>
                      </ul>
                      <h3 className="mb-4 text-lg font-semibold">Treatment Recommendations</h3>
                      <p>
                        {metrics.overall < 30
                          ? "Continue current treatment regimen with regular monitoring. Consider physical therapy to maintain motor function."
                          : metrics.overall < 60
                            ? "Evaluate current medication dosage and timing. Consider adding physical and occupational therapy to the treatment plan."
                            : "Urgent medication adjustment recommended. Consider referral to movement disorder specialist for advanced treatment options including deep brain stimulation evaluation."}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Report
                      </Button>
                      <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Save to Patient Record
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
