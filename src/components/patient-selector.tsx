"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Patient {
  id: string
  fName: string
  lName: string
}

interface PatientSelectorProps {
  onPatientSelect: (patient: Patient) => void
  initialValue?: Patient
}

export function PatientSelector({ onPatientSelect, initialValue }: PatientSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [loading, setLoading] = React.useState(true)

  // Update value when initialValue changes
  React.useEffect(() => {
    if (initialValue) {
      setValue(`${initialValue.fName} ${initialValue.lName}`)
    }
  }, [initialValue])

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/patient')
        if (!response.ok) {
          throw new Error('Failed to fetch patients')
        }
        const data = await response.json()
        if (data.success) {
          setPatients(data.data)
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const handlePatientSelect = async (patient: Patient) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/patient/name/${encodeURIComponent(patient.fName)}/${encodeURIComponent(patient.lName)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch patient details')
      }
      const data = await response.json()
      if (data.success) {
        setValue(`${patient.fName} ${patient.lName}`)
        onPatientSelect(data.data)
      }
    } catch (error) {
      console.error('Error fetching patient details:', error)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select patient..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search patient..." />
          <CommandEmpty>No patient found.</CommandEmpty>
          <CommandGroup>
            {patients.map((patient) => (
              <CommandItem
                key={patient.id}
                value={`${patient.fName} ${patient.lName}`}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  handlePatientSelect(patient)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === `${patient.fName} ${patient.lName}` ? "opacity-100" : "opacity-0"
                  )}
                />
                {patient.fName} {patient.lName}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 