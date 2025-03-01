/**
 * @description
 * A client component for displaying and managing (read, update, delete)
 * the user's existing equity data in a table format.
 *
 * Key features:
 * - Shows each record with its grantType, shares, strikePrice (from equityDetails)
 * - Allows inline editing of each record
 * - Allows deleting a record
 * - Maintains local component state for immediate UI updates
 *
 * @dependencies
 * - updateEquityDataAction, deleteEquityDataAction from "@/actions/db/equity-data-actions"
 * - useState from React
 * - toast from "@/lib/hooks/use-toast" for notifications
 *
 * @notes
 * - For more advanced editing (multiple fields, validations), consider a separate form or modal.
 * - This is a minimal example to satisfy read, update, delete requirements from Step 6.
 */

"use client"

import { useState } from "react"
import { SelectEquityData, InsertEquityData } from "@/db/schema/equity-schema"
import {
  deleteEquityDataAction,
  updateEquityDataAction
} from "@/actions/db/equity-data-actions"
import { toast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EquityDataTableProps {
  userId: string
  initialData: SelectEquityData[]
}

interface EditingState {
  [id: string]: {
    grantType: string
    shares: number
    strikePrice: number
  }
}

export default function EquityDataTable({
  userId,
  initialData
}: EquityDataTableProps) {
  const [equityData, setEquityData] = useState<SelectEquityData[]>(initialData)
  const [editing, setEditing] = useState<EditingState>({})

  /**
   * @function handleDelete
   * Calls deleteEquityDataAction, and upon success,
   * removes that record from local state.
   */
  async function handleDelete(id: string) {
    const result = await deleteEquityDataAction(id)
    if (!result.isSuccess) {
      toast({
        title: "Error Deleting",
        description: result.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Deleted",
      description: "Record deleted successfully."
    })

    setEquityData(prev => prev.filter(item => item.id !== id))
  }

  /**
   * @function handleEdit
   * Toggles editing mode for a row. If we're entering editing mode, populate
   * the editing state with the current record's equityDetails.
   */
  function handleEdit(record: SelectEquityData) {
    const details = record.equityDetails as Record<string, any>
    setEditing(prev => ({
      ...prev,
      [record.id]: {
        grantType: details.grantType || "",
        shares: details.shares || 0,
        strikePrice: details.strikePrice || 0
      }
    }))
  }

  /**
   * @function handleCancel
   * Cancels editing mode for a row, discarding changes from local state.
   */
  function handleCancel(id: string) {
    setEditing(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }

  /**
   * @function handleSave
   * Calls updateEquityDataAction with the updated fields. On success,
   * updates local state to reflect changes, then leaves editing mode.
   */
  async function handleSave(record: SelectEquityData) {
    const editData = editing[record.id]
    if (!editData) return

    // Build partial data for the updated equityDetails
    const updatedDetails = {
      grantType: editData.grantType,
      shares: Number(editData.shares),
      strikePrice: Number(editData.strikePrice)
    }

    // We'll do partial update of the equity data record
    const partial: Partial<InsertEquityData> = {
      equityDetails: updatedDetails
    }

    const result = await updateEquityDataAction(record.id, partial)
    if (!result.isSuccess) {
      toast({
        title: "Error Updating",
        description: result.message,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Updated",
      description: "Record updated successfully."
    })

    // Update local state
    setEquityData(prev =>
      prev.map(item =>
        item.id === record.id
          ? { ...item, equityDetails: updatedDetails }
          : item
      )
    )

    // Exit editing mode
    handleCancel(record.id)
  }

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-xl font-semibold">Your Existing Equity Data</h2>

      {equityData.length === 0 ? (
        <p className="text-sm italic">No equity records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Grant Type</th>
                <th className="p-2 text-left">Shares</th>
                <th className="p-2 text-left">Strike Price</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equityData.map(record => {
                const details = record.equityDetails as Record<string, any>
                const isEditing = editing[record.id] !== undefined

                return (
                  <tr key={record.id} className="border-b">
                    <td className="p-2">
                      {isEditing ? (
                        <Input
                          type="text"
                          value={editing[record.id].grantType}
                          onChange={e =>
                            setEditing(prev => ({
                              ...prev,
                              [record.id]: {
                                ...prev[record.id],
                                grantType: e.target.value
                              }
                            }))
                          }
                        />
                      ) : (
                        details.grantType || ""
                      )}
                    </td>

                    <td className="p-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editing[record.id].shares}
                          onChange={e =>
                            setEditing(prev => ({
                              ...prev,
                              [record.id]: {
                                ...prev[record.id],
                                shares: Number(e.target.value)
                              }
                            }))
                          }
                        />
                      ) : (
                        details.shares || 0
                      )}
                    </td>

                    <td className="p-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editing[record.id].strikePrice}
                          onChange={e =>
                            setEditing(prev => ({
                              ...prev,
                              [record.id]: {
                                ...prev[record.id],
                                strikePrice: Number(e.target.value)
                              }
                            }))
                          }
                        />
                      ) : (
                        details.strikePrice || 0
                      )}
                    </td>

                    <td className="space-x-2 p-2">
                      {!isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(record)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(record.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
