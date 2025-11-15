"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Tag, Trash2, Edit, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface JobTag {
  id: string
  name: string
  color: string
  description: string | null
  jobCount: number
  createdAt: string
}

export function JobTagsManager() {
  const [tags, setTags] = useState<JobTag[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTag, setNewTag] = useState({ name: "", color: "#3b82f6", description: "" })
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchQuery])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (sortBy) params.append("sortBy", sortBy)
      
      const res = await fetch(`/api/employer/tags?${params}`)
      if (res.ok) {
        const data = await res.json()
        setTags(data)
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTag = async () => {
    if (!newTag.name.trim()) {
      toast({
        title: "Error",
        description: "Tag name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setCreating(true)
      const res = await fetch("/api/employer/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Tag created successfully",
        })
        setIsCreateOpen(false)
        setNewTag({ name: "", color: "#3b82f6", description: "" })
        fetchTags()
      } else {
        const error = await res.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create tag",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return

    try {
      const res = await fetch(`/api/employer/tags?id=${tagId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Tag deleted successfully",
        })
        fetchTags()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete tag",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage your tags</h1>
          <p className="text-muted-foreground mt-1">
            <Link href="/employer/help-center" className="text-primary hover:underline">
              Learn more about tags
            </Link>
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create tag
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Tag name</SelectItem>
                <SelectItem value="createdAt">Created date</SelectItem>
                <SelectItem value="jobCount">Number of jobs</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />

            <div className="text-sm text-muted-foreground flex items-center">
              {tags.length} result{tags.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags List or Empty State */}
      {loading ? (
        <Card>
          <CardContent className="pt-16 pb-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : tags.length > 0 ? (
        <div className="grid gap-4">
          {tags.map((tag) => (
            <Card key={tag.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div>
                      <h3 className="font-semibold">{tag.name}</h3>
                      {tag.description && (
                        <p className="text-sm text-muted-foreground">{tag.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {tag.jobCount} job{tag.jobCount !== 1 ? 's' : ''} • Created {new Date(tag.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-16 pb-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 relative mb-6">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="80" cy="80" r="50" fill="#FFF4E6" stroke="#F97316" strokeWidth="3" />
                  <line x1="115" y1="115" x2="160" y2="160" stroke="#F97316" strokeWidth="8" strokeLinecap="round" />
                  <rect x="120" y="40" width="60" height="80" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" rx="4" />
                  <line x1="130" y1="55" x2="170" y2="55" stroke="#3B82F6" strokeWidth="2" />
                  <line x1="130" y1="70" x2="170" y2="70" stroke="#3B82F6" strokeWidth="2" />
                  <line x1="130" y1="85" x2="160" y2="85" stroke="#3B82F6" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                It doesn&apos;t look like you&apos;re using tags yet.
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Create tags to organize your job postings. Tags make it easy to quickly search for a group of jobs in the future.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>Create your first tag</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">About Tags</h4>
              <p className="text-sm text-muted-foreground">
                Tags help you organize your job postings by category, department, location, or any custom criteria. 
                Create tags to quickly filter and find related jobs. You can add multiple tags to each job post.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Create a tag to organize your job postings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tag Name *</Label>
              <Input
                id="name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                placeholder="e.g., Engineering, Remote, Urgent"
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newTag.description}
                onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                placeholder="What is this tag for?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTag} disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
