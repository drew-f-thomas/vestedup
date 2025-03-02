"use client"

/**
 * @description
 * A modal component that displays a user's documents and allows them to upload,
 * tag, and delete documents. Documents are categorized by type to help organize
 * equity-related documents.
 *
 * Key Features:
 * - Main tabs separate upload and document viewing
 * - Documents are filtered by type using a radio group
 * - Hover tooltips provide information about document types
 * - Enables editing document titles and tags
 * - Provides document deletion
 * - Shows document details and preview
 *
 * @dependencies
 * - uploadDocumentStorage from "@/actions/storage/storage-actions"
 * - getDocumentsForUserAction, updateDocumentAction, deleteDocumentAction from "@/actions/db/documents-actions"
 * - Dialog component from shadcn/ui
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/lib/hooks/use-toast"
import {
  UploadCloud,
  File,
  Trash2,
  Edit,
  Save,
  X,
  FileText,
  FileImage,
  Info
} from "lucide-react"
import { uploadDocumentStorage } from "@/actions/storage/storage-actions"
import {
  getDocumentsForUserAction,
  updateDocumentAction,
  deleteDocumentAction
} from "@/actions/db/documents-actions"
import { SelectDocument, documentTagEnum } from "@/db/schema/documents-schema"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

// Map document tags to human-readable names
const documentTagLabels: Record<string, string> = {
  stock_option_grant: "Stock Option Grant",
  rsu_grant: "RSU Grant",
  stock_option_agreement: "Stock Option Agreement",
  valuation_report: "409A Valuation Report",
  "83b_election": "83(b) Election Form",
  vesting_schedule: "Vesting Schedule",
  other: "Other Documents"
}

// Map document tags to descriptions
const documentTagDescriptions: Record<string, string> = {
  stock_option_grant:
    "Outlines the type of grant, number of shares, and vesting schedule.",
  rsu_grant:
    "Details RSU grants including number of units and vesting schedule.",
  stock_option_agreement:
    "Detailed legal agreements specifying terms, strike price, and special clauses.",
  valuation_report:
    "Provides fair market value of the company's common stock for tax calculations.",
  "83b_election":
    "Indicates whether you chose to pay taxes at grant rather than at vest.",
  vesting_schedule:
    "Summaries of how many shares vest over time or at certain milestones.",
  other: "Other documents related to your equity compensation."
}

interface DocumentCenterModalProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export default function DocumentCenterModal({
  userId,
  isOpen,
  onClose
}: DocumentCenterModalProps) {
  const [documents, setDocuments] = useState<SelectDocument[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState<string>("all")
  const [editingDocId, setEditingDocId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editTag, setEditTag] = useState<string>("other")
  const [mainTab, setMainTab] = useState<string>("view")
  const router = useRouter()

  // Fetch documents when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDocuments()
    }
  }, [isOpen, userId])

  const fetchDocuments = async () => {
    const res = await getDocumentsForUserAction(userId)
    if (res.isSuccess) {
      setDocuments(res.data)
    } else {
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      })
    }
  }

  const handleUpload = async (formData: FormData) => {
    setIsUploading(true)

    try {
      const res = await uploadDocumentStorage(formData)

      if (!res.isSuccess) {
        toast({
          title: "Upload Error",
          description: res.message,
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Upload Success",
        description: "Document uploaded successfully"
      })

      // Refresh documents list
      fetchDocuments()

      // Switch to view tab after successful upload
      setMainTab("view")
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const startEditing = (doc: SelectDocument) => {
    setEditingDocId(doc.id)
    setEditTitle(doc.title || "")
    setEditTag(doc.documentTag || "other")
  }

  const cancelEditing = () => {
    setEditingDocId(null)
    setEditTitle("")
    setEditTag("other")
  }

  const saveDocumentChanges = async (docId: string) => {
    const res = await updateDocumentAction(docId, {
      title: editTitle,
      documentTag: editTag as any
    })

    if (res.isSuccess) {
      toast({
        title: "Success",
        description: "Document updated successfully"
      })
      fetchDocuments()
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive"
      })
    }

    cancelEditing()
  }

  const deleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    const res = await deleteDocumentAction(docId)

    if (res.isSuccess) {
      toast({
        title: "Success",
        description: "Document deleted successfully"
      })
      fetchDocuments()
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive"
      })
    }
  }

  // Filter documents based on selected type
  const filteredDocuments =
    selectedDocType === "all"
      ? documents
      : documents.filter(doc => doc.documentTag === selectedDocType)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Document Center</DialogTitle>
          <DialogDescription>
            Manage your equity documents. Upload, organize, and tag documents
            for easy reference.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="view"
          value={mainTab}
          onValueChange={setMainTab}
          className="flex flex-1 flex-col"
        >
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="view">View Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex-1 overflow-hidden">
            <div className="rounded-lg border p-4">
              <h2 className="mb-4 text-lg font-medium">Upload New Document</h2>
              <UploadDocumentForm
                userId={userId}
                onUpload={handleUpload}
                isUploading={isUploading}
                defaultTag={
                  selectedDocType !== "all" ? selectedDocType : undefined
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="view" className="flex-1 overflow-hidden">
            <div className="mb-6">
              <div className="mb-2 flex items-center">
                <h3 className="font-medium">Filter by Document Type</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 size-6"
                      >
                        <Info className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Select a document type to filter your documents</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Select
                value={selectedDocType}
                onValueChange={setSelectedDocType}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  {documentTagEnum.enumValues.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {documentTagLabels[tag]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDocType !== "all" && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {documentTagDescriptions[selectedDocType]}
                </p>
              )}
            </div>

            <ScrollArea className="h-[400px] pr-4">
              {filteredDocuments.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  {selectedDocType === "all"
                    ? "No documents yet. Switch to the Upload tab to add your first document."
                    : `No ${documentTagLabels[selectedDocType].toLowerCase()} documents yet.`}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      isEditing={editingDocId === doc.id}
                      editTitle={editTitle}
                      editTag={editTag}
                      onEditTitleChange={setEditTitle}
                      onEditTagChange={setEditTag}
                      onStartEdit={() => startEditing(doc)}
                      onCancelEdit={cancelEditing}
                      onSaveEdit={() => saveDocumentChanges(doc.id)}
                      onDelete={() => deleteDocument(doc.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface UploadDocumentFormProps {
  userId: string
  onUpload: (formData: FormData) => Promise<void>
  isUploading: boolean
  defaultTag?: string
}

function UploadDocumentForm({
  userId,
  onUpload,
  isUploading,
  defaultTag = "other"
}: UploadDocumentFormProps) {
  const [title, setTitle] = useState("")
  const [tag, setTag] = useState(defaultTag)

  // Update tag when defaultTag changes
  useEffect(() => {
    if (defaultTag !== "all") {
      setTag(defaultTag)
    }
  }, [defaultTag])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add userId
    formData.append("userId", userId)

    // Add title and tag
    formData.append("title", title)
    formData.append("documentTag", tag)

    await onUpload(formData)

    // Reset form
    setTitle("")
    form.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="title">Document Title</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter a descriptive title"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <Label htmlFor="documentTag">Document Type</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1 size-6">
                  <Info className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select the type of document you're uploading</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={tag} onValueChange={setTag}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documentTagEnum.enumValues.map(tagValue => (
              <SelectItem key={tagValue} value={tagValue}>
                {documentTagLabels[tagValue]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          {documentTagDescriptions[tag]}
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="file">Upload Document</Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept=".pdf,image/*"
          required
        />
      </div>

      <Button type="submit" disabled={isUploading} className="w-full">
        {isUploading ? (
          <>
            <UploadCloud className="mr-2 size-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 size-4" />
            Upload Document
          </>
        )}
      </Button>
    </form>
  )
}

interface DocumentCardProps {
  document: SelectDocument
  isEditing: boolean
  editTitle: string
  editTag: string
  onEditTitleChange: (title: string) => void
  onEditTagChange: (tag: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  onDelete: () => void
}

function DocumentCard({
  document,
  isEditing,
  editTitle,
  editTag,
  onEditTitleChange,
  onEditTagChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete
}: DocumentCardProps) {
  const fileName = document.filePath.split("/").pop() || "Unknown file"
  const uploadDate = new Date(document.uploadedAt).toLocaleDateString()

  return (
    <Card>
      <CardHeader className="pb-2">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={e => onEditTitleChange(e.target.value)}
              placeholder="Document title"
            />
            <Select value={editTag} onValueChange={onEditTagChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTagEnum.enumValues.map(tagValue => (
                  <SelectItem key={tagValue} value={tagValue}>
                    {documentTagLabels[tagValue]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <>
            <CardTitle className="flex items-center text-base">
              {document.fileType === "pdf" ? (
                <FileText className="mr-2 size-4 text-red-500" />
              ) : (
                <FileImage className="mr-2 size-4 text-blue-500" />
              )}
              {document.title || fileName}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="mt-1 cursor-help">
                    {documentTagLabels[document.documentTag || "other"]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {documentTagDescriptions[document.documentTag || "other"]}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        <div>Uploaded: {uploadDate}</div>
        <div className="truncate">File: {fileName}</div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {isEditing ? (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              <X className="mr-1 size-3" />
              Cancel
            </Button>
            <Button size="sm" onClick={onSaveEdit}>
              <Save className="mr-1 size-3" />
              Save
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onStartEdit}>
              <Edit className="mr-1 size-3" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-1 size-3" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
