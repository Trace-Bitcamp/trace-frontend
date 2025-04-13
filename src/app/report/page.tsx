"use client"

import React, { useEffect, useState } from "react"
import Markdown from "react-markdown"
import { useSearchParams } from "next/navigation"

const markdownContent = `
# Report Title

This is a sample report rendered in **Markdown**.

## Section 1

- Item 1
- Item 2
- Item 3

## Section 2

Here is a code block:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

> This is a blockquote.

**Thank you for reading!**
`

const fetchGemOut = async (id: string) => {
  const response = await fetch(`http://127.0.0.1:5000/gemini_report/${id}`, {
    method: 'POST', // Ensure the method is POST
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch gemini report');
  }
  return response.text(); // Assuming the response is text containing markdown
}

export default function ReportPage() {
  const [markdown, setMarkdown] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  const searchParams = useSearchParams()
  const patientId = searchParams.get('patientId')

  useEffect(() => {
    const loadGeminiOutput = async () => {
      if (patientId) {
        try {
          const output = await fetchGemOut(patientId)
          setMarkdown(output)
        } catch (error) {
          console.error('Error fetching gemini output:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadGeminiOutput()
  }, [patientId])

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>
  }

  return (
    <div className="container prose mx-auto py-10">
      <Markdown>{markdown}</Markdown>
    </div>
  )
}
