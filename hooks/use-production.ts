"use client"

import { useState } from "react"
import type { ProductionRecord } from "@/types/production"

export function useProduction() {
  const [selectedRecord, setSelectedRecord] = useState<ProductionRecord | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(null)
  const [isNewProductionOpen, setIsNewProductionOpen] = useState(false)

  const handleViewRecord = (record: ProductionRecord) => {
    setSelectedRecord(record)
  }

  const handleEditRecord = (record: ProductionRecord) => {
    setEditingRecord(record)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedRecord: ProductionRecord) => {
    console.log("Updated record:", updatedRecord)
    setIsEditModalOpen(false)
    setEditingRecord(null)
  }

  const closeDetailModal = () => {
    setSelectedRecord(null)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingRecord(null)
  }

  const openNewProduction = () => {
    setIsNewProductionOpen(true)
  }

  const closeNewProduction = () => {
    setIsNewProductionOpen(false)
  }

  return {
    selectedRecord,
    isEditModalOpen,
    editingRecord,
    isNewProductionOpen,
    handleViewRecord,
    handleEditRecord,
    handleSaveEdit,
    closeDetailModal,
    closeEditModal,
    openNewProduction,
    closeNewProduction,
  }
}
