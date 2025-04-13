"use client"

import React from "react"
import Markdown from "react-markdown"

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

export default function ReportPage() {
  return (
    <div className="container prose mx-auto py-10">
        <Markdown>{markdownContent}</Markdown> 
    </div>
  )
}
