"use client"

/**
 * @description
 * A sidebar component that provides access to the document center.
 * It displays a button in the sidebar that opens the document center modal.
 *
 * Key Features:
 * - Displays a button in the sidebar footer
 * - Opens the document center modal when clicked
 * - Shows document count badge
 *
 * @dependencies
 * - DocumentCenterModal from "@/components/document/document-center-modal"
 * - getDocumentsForUserAction from "@/actions/db/documents-actions"
 */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"
import { getDocumentsForUserAction } from "@/actions/db/documents-actions"
import DocumentCenterModal from "@/components/document/document-center-modal"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/lib/hooks/use-toast"

interface DocumentSidebarTriggerProps {
  userId: string
}

export default function DocumentSidebarTrigger({
  userId
}: DocumentSidebarTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [documentCount, setDocumentCount] = useState(0)

  // Fetch document count on mount and when modal closes
  useEffect(() => {
    fetchDocumentCount()
  }, [userId, isModalOpen])

  const fetchDocumentCount = async () => {
    try {
      const res = await getDocumentsForUserAction(userId)
      if (res.isSuccess) {
        setDocumentCount(res.data.length)
      }
    } catch (error) {
      console.error("Error fetching document count:", error)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="p-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleOpenModal}
        >
          <FileText className="mr-2 size-4" />
          Document Center
          {documentCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {documentCount}
            </Badge>
          )}
        </Button>
      </div>

      <DocumentCenterModal
        userId={userId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
