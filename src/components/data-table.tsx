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

export const schema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  status: z.string(),
  reportedBy: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  upvotes: z.array(z.any()),
  timeline: z.array(z.any()),
  images: z.array(z.string()),
  lat: z.number(),
  lng: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

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

const columns: ColumnDef<z.infer<typeof schema>>[] = [
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
      return <TableCellViewer item={row.original} />
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
        {row.original.location.split(",")[0]}
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
    accessorKey: "reportedBy.name",
    header: "Reported By",
    cell: ({ row }) => (
      <div className="w-32 flex items-center gap-1">
        <IconUser className="size-3 text-muted-foreground" />
        {row.original.reportedBy.name}
      </div>
    ),
  },
  {
    accessorKey: "upvotes",
    header: () => <div className="w-full text-right">Upvotes</div>,
    cell: ({ row }) => (
      <div className="text-right flex items-center justify-end gap-1">
        <IconThumbUp className="size-3 text-muted-foreground" />
        {row.original.upvotes.length}
      </div>
    ),
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
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit Status</DropdownMenuItem>
          <DropdownMenuItem>Assign</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

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
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
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

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ _id }) => _id) || [],
    [data]
  )

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

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="outline">All Issues</TabsTrigger>
          <TabsTrigger value="past-performance">Map View</TabsTrigger>
          <TabsTrigger value="key-personnel">Analytics</TabsTrigger>
          <TabsTrigger value="focus-documents">Reports</TabsTrigger>
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
          
          <Button size="sm">
            <IconPlus className="size-4 mr-2" />
            New Issue
          </Button>
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
                {table.getRowModel().rows?.length ? (
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

const chartData = [
  { month: "January", issues: 186, resolved: 80 },
  { month: "February", issues: 305, resolved: 200 },
  { month: "March", issues: 237, resolved: 120 },
  { month: "April", issues: 173, resolved: 90 },
  { month: "May", issues: 209, resolved: 130 },
  { month: "June", issues: 214, resolved: 140 },
]

const chartConfig = {
  issues: {
    label: "Total Issues",
    color: "var(--primary)",
  },
  resolved: {
    label: "Resolved",
    color: "var(--green-500)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className={!isMobile ? "w-[800px] ml-auto" : ""}>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="text-2xl">{item.title}</DrawerTitle>
          <DrawerDescription>
            Reported on {new Date(item.createdAt).toLocaleDateString()} by {item.reportedBy.name}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="flex flex-col gap-6 overflow-y-auto px-6 text-sm">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Left Column - Issue Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="flex flex-col gap-3">
                <Label className="font-semibold text-base">Description</Label>
                <p className="text-sm p-3 bg-muted/50 rounded-lg">{item.description}</p>
              </div>
              
              {/* Location & Coordinates */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-3">
                  <Label className="font-semibold">Location</Label>
                  <div className="flex items-start gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                    <IconMapPin className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="break-words">{item.location}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Label className="font-semibold">Coordinates</Label>
                  <div className="text-sm p-3 bg-muted/50 rounded-lg">
                    {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
                  </div>
                </div>
              </div>
              
              {/* Status & Actions */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-3">
                  <Label className="font-semibold">Status</Label>
                  <Select defaultValue={item.status}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Images */}
              {item.images.length > 0 && (
                <div className="flex flex-col gap-3">
                  <Label className="font-semibold text-base">Attached Images ({item.images.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {item.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Issue image ${index + 1}`}
                          className="rounded-lg border w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    <div className="font-medium truncate">{item.reportedBy.name}</div>
                    <div className="text-muted-foreground text-xs truncate">{item.reportedBy.email}</div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-col gap-3">
                <Label className="font-semibold text-base">Quick Stats</Label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="font-semibold">{item.upvotes.length}</div>
                    <div className="text-muted-foreground">Supporters</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="font-semibold">{item.images.length}</div>
                    <div className="text-muted-foreground">Images</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="font-semibold">
                      {Math.ceil((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-muted-foreground">Days Open</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="font-semibold">{item.timeline.length}</div>
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
              {item.timeline.map((timelineItem: any, index: number) => (
                <div key={timelineItem._id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`size-3 rounded-full ${
                      timelineItem.status === 'reported' ? 'bg-blue-500' :
                      timelineItem.status === 'in-progress' ? 'bg-yellow-500' :
                      timelineItem.status === 'resolved' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`} />
                    {index < item.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-1" />
                    )}
                  </div>
                  
                  {/* Timeline content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">{timelineItem.status.replace('-', ' ')}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(timelineItem.date).toLocaleDateString()} at {new Date(timelineItem.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      By {timelineItem.by.name} ({timelineItem.by.email})
                    </div>
                    {timelineItem.note && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                        {timelineItem.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add new timeline entry */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-3 rounded-full bg-border" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-3">
                    <Label className="font-semibold">Add Update</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="municipal-worker">Municipal Worker</SelectItem>
                          <SelectItem value="cleanup-team">Cleanup Team</SelectItem>
                          <SelectItem value="engineer">Engineer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm" className="self-start">
                      Add Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Data Section */}
          <div className="flex flex-col gap-3 border-t mb-10">
            <Label className="font-semibold text-base">Technical Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-muted/50 rounded">
                <div className="font-semibold">Created</div>
                <div className="text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="font-semibold">Updated</div>
                <div className="text-muted-foreground">{new Date(item.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}