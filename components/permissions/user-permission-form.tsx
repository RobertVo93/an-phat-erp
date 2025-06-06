"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ROLE_LABELS } from "@/constants/nav"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, ArrowLeft, Shield, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "@/constants/nav"
import { UserRole } from "@/types"

interface UserPermissionFormProps {
  userId: string
}

export function UserPermissionForm({ userId }: UserPermissionFormProps) {
  const router = useRouter()
  const {
    user,
    loading,
    saving,
    updateUserPagePermission,
    getUserPagePermission,
    savePermissions,
    toggleAllCategoryPermissions,
    getUserCategoryPermissionCount,
  } = useUserPermissions(userId)

  const [activeTab, setActiveTab] = useState("all")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading user permissions...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">User Not Found</h2>
        <p className="text-gray-600 mb-4">The user you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => router.push("/permissions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {user.username
                ?.split(" ")
                ?.map((n: string) => n[0])
                ?.join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs mr-2",
                  user.role === UserRole.super_admin
                    ? "bg-red-100 text-red-800 border-red-200"
                    : user.role === UserRole.admin
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : user.role === UserRole.manager
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : user.role === UserRole.staff
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200",
                )}
              >
                {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => router.push("/permissions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          <Button onClick={() => savePermissions(userId)} disabled={saving || user.role === UserRole.super_admin}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Permissions
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Super Admin Warning */}
      {user.role === UserRole.super_admin && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-amber-600" />
              <div>
                <h3 className="font-medium text-amber-800">Super Admin Permissions</h3>
                <p className="text-sm text-amber-700">
                  Super Admins automatically have access to all pages and features. Their permissions cannot be
                  modified.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permissions Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Permissions</TabsTrigger>
          {navItems.map((category) => (
            <TabsTrigger key={category.id} value={category.id || ""}>
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Permissions Tab */}
        <TabsContent value="all">
          <div className="grid gap-6">
            {navItems.map((category) => {
              const { granted, total } = getUserCategoryPermissionCount(userId, category.id || "")
              const allGranted = granted === total

              return (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>
                          {granted} of {total} permissions granted
                        </CardDescription>
                      </div>
                      <Button
                        variant={allGranted ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleAllCategoryPermissions(userId, category.id || "", !allGranted)}
                        disabled={user.role === UserRole.super_admin}
                      >
                        {allGranted ? "Revoke All" : "Grant All"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.children?.map((page) => (
                        <div
                          key={page.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-md",
                            getUserPagePermission(userId, page.id || "")
                              ? "bg-green-50 border border-green-100"
                              : "bg-gray-50 border border-gray-100",
                          )}
                        >
                          <div>
                            <p className="font-medium text-sm">{page.title}</p>
                            <p className="text-xs text-gray-500">{page.href}</p>
                          </div>
                          <Checkbox
                            checked={getUserPagePermission(userId, page.id || "")}
                            onCheckedChange={(checked) => updateUserPagePermission(userId, page.id || "", !!checked)}
                            disabled={user.role === UserRole.super_admin}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Individual Category Tabs */}
        {navItems.map((category) => (
          <TabsContent key={category.id} value={category.id || ""}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{category.title} Permissions</CardTitle>
                    <CardDescription>Manage access to {category.title.toLowerCase()} pages</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const { granted, total } = getUserCategoryPermissionCount(userId, category.id || "")
                      toggleAllCategoryPermissions(userId, category.id || "", granted !== total)
                    }}
                    disabled={user.role === UserRole.super_admin}
                  >
                    Toggle All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.children?.map((page) => (
                    <div
                      key={page.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-md",
                        getUserPagePermission(userId, page.id || "")
                          ? "bg-green-50 border border-green-100"
                          : "bg-gray-50 border border-gray-100",
                      )}
                    >
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{page.title}</h3>
                          {getUserPagePermission(userId, page.id || "") && (
                            <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Granted</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Page path: {page.href}</p>
                      </div>
                      <Checkbox
                        checked={getUserPagePermission(userId, page.id || "")}
                        onCheckedChange={(checked) => updateUserPagePermission(userId, page.id || "", !!checked)}
                        disabled={user.role === UserRole.super_admin}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
