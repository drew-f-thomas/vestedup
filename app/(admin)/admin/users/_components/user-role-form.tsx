"use client"

import { useState } from "react"
import { updateProfileAction } from "@/actions/db/profiles-actions"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface UserRoleFormProps {
  userId: string
  currentRole: string
}

export default function UserRoleForm({
  userId,
  currentRole
}: UserRoleFormProps) {
  const [role, setRole] = useState(currentRole)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleChange = async () => {
    if (role === currentRole) return

    setIsLoading(true)
    try {
      const result = await updateProfileAction(userId, {
        membership: role as "free" | "pro" | "admin"
      })

      if (result.isSuccess) {
        toast({
          title: "Role updated",
          description: `User ${userId} is now a ${role} user.`,
          variant: "default"
        })
      } else {
        toast({
          title: "Error updating role",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error updating role",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRoleChange}
        disabled={isLoading || role === currentRole}
      >
        {isLoading ? "Updating..." : "Update"}
      </Button>
    </div>
  )
}
