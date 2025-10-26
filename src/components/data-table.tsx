"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
  IconMapPin,
  IconUser,
  IconCalendar,
  IconThumbUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import api from "@/config/axios.config"
import { Loader2 } from "lucide-react"

export const schema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  status: z.string(),
  createdBy: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  upvotes: z.union([z.number(), z.array(z.any()), z.record(z.string(), z.any())]),
  timeline: z.array(z.any()),
  images: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// API Types
type UpdateStatus = {
  issue_id: string;
  status: string;
}

type AssignIssue = {
  issue_id: string;
  user_id: string;
}

type ApiResponse = {
  status: string;
}

// API functions
export const changeStaus = async (update_status: UpdateStatus): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(`/issues/${update_status.issue_id}/status`, {
      status: update_status.status
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignIssuetouser = async (assignIssue: AssignIssue): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(`/issues/${assignIssue.issue_id}/assign`, {
      workerId: assignIssue.user_id
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Default worker ID and mock workers
const DEFAULT_WORKER_ID = "68fdf6c6db91007bdb0f63c1";

const WORKERS = [
  { id: "68fdf6c6db91007bdb0f63c1", name: "Amit Singh", role: "Cleanup Team" },
  { id: "68fdf6cedb91007bdb0f63c4", name: "Anjali Patel", role: "Engineer" },
  { id: "68fdf6bfdb91007bdb0f63be", name: "Priya Sharma", role: "Sanitation Dept" },
  { id: "68fdf6b4db91007bdb0f63bb", name: "Rajesh Kumar", role: "Public Works" }
];

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const createColumns = (refetch: () => void): ColumnDef<z.infer<typeof schema>>[] => [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original._id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} refetch={refetch} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate flex items-center gap-1">
        <IconMapPin className="size-3 text-muted-foreground" />
        {row.original.location?.lat ? `${row.original.location.lat.toFixed(4)}, ${row.original.location.lng.toFixed(4)}` : 'N/A'}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className={`px-1.5 ${
          row.original.status === "resolved" 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            : row.original.status === "in-progress"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        }`}
      >
        {row.original.status === "resolved" ? (
          <IconCircleCheckFilled className="size-3 mr-1" />
        ) : (
          <IconLoader className="size-3 mr-1" />
        )}
        {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: "createdBy.name",
    header: "Reported By",
    cell: ({ row }) => (
      <div className="w-32 flex items-center gap-1">
        <IconUser className="size-3 text-muted-foreground" />
        {row.original.createdBy?.name || 'Unknown User'}
      </div>
    ),
  },
  {
    accessorKey: "upvotes",
    header: () => <div className="w-full text-right">Upvotes</div>,
    cell: ({ row }) => {
      const upvotes = row.original.upvotes;
      const upvotesCount = typeof upvotes === 'number' ? upvotes : 
                          Array.isArray(upvotes) ? upvotes.length : 
                          typeof upvotes === 'object' && upvotes !== null ? Object.keys(upvotes).length : 0;
      
      return (
        <div className="text-right flex items-center justify-end gap-1">
          <IconThumbUp className="size-3 text-muted-foreground" />
          {upvotesCount}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Reported Date",
    cell: ({ row }) => (
      <div className="w-32 flex items-center gap-1">
        <IconCalendar className="size-3 text-muted-foreground" />
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  }
]

const columns: ColumnDef<z.infer<typeof schema>>[] = []

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original._id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
  isLoading,
  refetch
}: {
  data: z.infer<typeof schema>[] | undefined
  isLoading: boolean
  refetch: () => void
}) {
  const [data, setData] = React.useState(() => initialData || [])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData || [])
  }, [initialData])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ _id }) => _id) || [],
    [data]
  )

  const columns = React.useMemo(() => createColumns(refetch), [refetch])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row._id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  if(isLoading) {
    return (<>
    <div className="h-full w-full">
      <Loader2/>
    </div>
    </>)
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="outline">All Issues</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="size-4 mr-2" />
                Columns
                <IconChevronDown className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          

        </div>
      </div>

      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter issues..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => 
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel()?.rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No issues found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center">
          <div className="text-center">
            <IconMapPin className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Map View</h3>
            <p className="text-muted-foreground">Interactive map showing issue locations</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center">
          <div className="text-center">
            <IconTrendingUp className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Charts and insights about civic issues</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center">
          <div className="text-center">
            <IconLayoutColumns className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Reports</h3>
            <p className="text-muted-foreground">Generate and view detailed reports</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function TableCellViewer({ item, refetch }: { item: z.infer<typeof schema>, refetch: () => void }) {
  const isMobile = useIsMobile()
  const [currentStatus, setCurrentStatus] = React.useState(item.status)
  const [assignedWorker, setAssignedWorker] = React.useState(DEFAULT_WORKER_ID)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Function to handle status change
  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const updateData: UpdateStatus = {
        issue_id: item._id,
        status: newStatus
      }
      
      const response = await changeStaus(updateData)
      
      if (response.status === "success") {
        refetch()
        setCurrentStatus(newStatus)
        toast.success("Status updated successfully!", {
          description: `Issue status changed to ${newStatus.replace('-', ' ')}`
        })
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update status", {
        description: "Please try again later."
      })
      // Revert the status change on error
      setCurrentStatus(item.status)
    } finally {
      setIsUpdating(false)
    }
  }

  // Function to handle assignment change
  const handleAssignmentChange = async (workerId: string) => {
    setIsUpdating(true)
    try {
      const assignData: AssignIssue = {
        issue_id: item._id,
        user_id: workerId
      }
      
      const response = await assignIssuetouser(assignData)
      
      if (response.status === "success") {
        refetch()
        setAssignedWorker(workerId)
        const worker = WORKERS.find(w => w.id === workerId)
        toast.success("Issue assigned successfully!", {
          description: `Assigned to ${worker?.name}`
        })
      }
    } catch (error) {
      console.error("Failed to assign issue:", error)
      toast.error("Failed to assign issue", {
        description: "Please try again later."
      })
      // Revert the assignment on error
      setAssignedWorker(DEFAULT_WORKER_ID)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className={!isMobile ? "min-w-[600px] ml-auto" : ""}>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="text-2xl">{item.title}</DrawerTitle>
          <DrawerDescription>
            Reported on {new Date(item.createdAt).toLocaleDateString()} by {item.createdBy?.name || 'Unknown User'}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="flex flex-col gap-6 overflow-y-auto px-6 text-sm">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Left Column - Issue Details */}
            <div className="space-y-6">
              {/* Description */}
              <div className="flex flex-col gap-3">
                <Label className="font-semibold text-base">Description</Label>
                <p className="text-sm p-3 bg-muted/50 rounded-lg">{item.description}</p>
              </div>
              
              {/* Location & Coordinates */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-3">
                  <Label className="font-semibold">Coordinates</Label>
                  <div className="text-sm p-3 bg-muted/50 rounded-lg">
                    {item.location?.lat ? `${item.location.lat.toFixed(6)}, ${item.location.lng.toFixed(6)}` : 'N/A'}
                  </div>
                </div>
              </div>
              
              {/* Status & Assignment */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-3">
                  <Label className="font-semibold">Status</Label>
                  <Select 
                    value={currentStatus} 
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                      {isUpdating && <IconLoader className="size-4 animate-spin ml-2" />}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Label className="font-semibold">Assign To</Label>
                  <Select 
                    value={assignedWorker} 
                    onValueChange={handleAssignmentChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                      {isUpdating && <IconLoader className="size-4 animate-spin ml-2" />}
                    </SelectTrigger>
                    <SelectContent>
                      {WORKERS.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id}>
                          {worker.name} - {worker.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Right Column - Metadata & Timeline */}
            <div className="space-y-6">
              {/* Reporter Information */}
              <div className="flex flex-col gap-3">
                <Label className="font-semibold text-base">Reported By</Label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex size-8 bg-primary/10 rounded-full items-center justify-center">
                    <IconUser className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.createdBy?.name || 'Unknown User'}</div>
                    <div className="text-muted-foreground text-xs truncate">{item.createdBy?._id || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              {/* Assigned Worker Information */}
              <div className="flex flex-col gap-3">
                <Label className="font-semibold text-base">Currently Assigned To</Label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex size-8 bg-green-100 rounded-full items-center justify-center">
                    <IconUser className="size-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {WORKERS.find(w => w.id === assignedWorker)?.name || "Unassigned"}
                    </div>
                    <div className="text-muted-foreground text-xs truncate">
                      {WORKERS.find(w => w.id === assignedWorker)?.role || "Not assigned"}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-col gap-3">
                <Label className="font-semibold text-base">Quick Stats</Label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="font-semibold">
                      {typeof item.upvotes === 'number' ? item.upvotes : 
                       Array.isArray(item.upvotes) ? item.upvotes.length : 
                       typeof item.upvotes === 'object' && item.upvotes !== null ? Object.keys(item.upvotes).length : 0}
                    </div>
                    <div className="text-muted-foreground">Supporters</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="font-semibold">{item.images?.length || 0}</div>
                    <div className="text-muted-foreground">Images</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="font-semibold">
                      {Math.ceil((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-muted-foreground">Days Open</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="font-semibold">{item.timeline?.length || 0}</div>
                    <div className="text-muted-foreground">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline Section - Full Width */}
          <div className="flex flex-col gap-3 border-t pt-6">
            <Label className="font-semibold text-base">Timeline & Activity</Label>
            <div className="space-y-4">
              {item.timeline && item.timeline.length > 0 ? item.timeline.filter(timelineItem => timelineItem).map((timelineItem: any, index: number) => (
                <div key={timelineItem._id || index} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`size-3 rounded-full ${
                      timelineItem.status === 'reported' ? 'bg-blue-500' :
                      timelineItem.status === 'in-progress' ? 'bg-yellow-500' :
                      timelineItem.status === 'resolved' ? 'bg-green-500' :
                      timelineItem.status === 'assigned' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                    {index < item.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-1" />
                    )}
                  </div>
                  
                  {/* Timeline content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">{timelineItem.status?.replace('-', ' ') || 'Unknown Status'}</span>
                      <span className="text-muted-foreground text-xs">
                        {timelineItem.date ? `${new Date(timelineItem.date).toLocaleDateString()} at ${new Date(timelineItem.date).toLocaleTimeString()}` : 'No date available'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      By {timelineItem.by?.name || 'Unknown User'} ({timelineItem.by?.email || 'N/A'})
                    </div>
                    {timelineItem.note && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                        {timelineItem.note}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center text-muted-foreground py-8">
                  No timeline data available
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Data Section */}
          <div className="flex flex-col gap-3 border-t mb-10">
            <Label className="font-semibold text-base">Technical Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-muted/50 rounded">
                <div className="font-semibold">Issue ID</div>
                <div className="text-muted-foreground truncate">{item._id}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="font-semibold">Created</div>
                <div className="text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="font-semibold">Updated</div>
                <div className="text-muted-foreground">{new Date(item.updatedAt).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="font-semibold">Current Status</div>
                <div className="text-muted-foreground capitalize">{currentStatus}</div>
              </div>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="flex-row gap-3 justify-end">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isUpdating && (
              <>
                <IconLoader className="size-4 animate-spin" />
                <span>Updating...</span>
              </>
            )}
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}