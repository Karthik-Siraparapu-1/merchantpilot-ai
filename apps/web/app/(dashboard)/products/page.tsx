'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Package,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Sparkles,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Product } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ExplainabilityDrawer } from '@/components/ai/explainability-drawer';
import { pricingEngine } from '@/lib/ai/pricing-engine';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

// Create Product Form Validation Schema
const createProductSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  sku: z.string().min(2, 'SKU must be at least 2 characters').toUpperCase(),
  price: z.coerce.number().min(1, 'Price must be at least ₹1'),
  description: z.string().optional(),
  initialStock: z.coerce.number().min(0, 'Stock cannot be negative'),
  reorderThreshold: z.coerce.number().min(0)
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

export default function ProductsPage() {
  const { activeTenantId } = useAuth();
  const queryClient = useQueryClient();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Drawer / Modal states
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // AI Dynamic Pricing & Explainability
  const [explainDrawerOpen, setExplainDrawerOpen] = useState(false);
  const [selectedExplainProduct, setSelectedExplainProduct] = useState<Product | null>(null);

  // Fetch Products Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', activeTenantId, page, searchTerm, statusFilter],
    queryFn: () =>
      api.products.list({
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined
      }),
    enabled: !!activeTenantId
  });

  // Create Product Form
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: isCreating }
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: '',
      sku: '',
      price: 999,
      description: '',
      initialStock: 25,
      reorderThreshold: 5
    }
  });

  // Create Product Mutation
  const createMutation = useMutation({
    mutationFn: (values: CreateProductFormData) =>
      api.products.create({
        title: values.title,
        sku: values.sku,
        priceMinor: Math.round(values.price * 100),
        description: values.description,
        initialStock: values.initialStock,
        reorderThreshold: values.reorderThreshold
      }),
    onSuccess: () => {
      toast.success('Product created and stock catalog synchronized!');
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setCreateDrawerOpen(false);
      resetCreate();
    },
    onError: (err: unknown) => {
      let message = 'Failed to create product';
      if (axios.isAxiosError<{ message?: string | string[] }>(err) && err.response?.data?.message) {
        const d = err.response.data.message;
        message = Array.isArray(d) ? d.join(', ') : String(d);
      }
      toast.error(message);
    }
  });

  // Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: () => {
      toast.success('Product archived successfully.');
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteProduct(null);
    },
    onError: (err: unknown) => {
      let message = 'Failed to delete product';
      if (axios.isAxiosError<{ message?: string | string[] }>(err) && err.response?.data?.message) {
        const d = err.response.data.message;
        message = Array.isArray(d) ? d.join(', ') : String(d);
      }
      toast.error(message);
    }
  });

  // Edit Product Mutation
  const editMutation = useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: Partial<{
        title?: string;
        description?: string;
        priceMinor?: number;
        status?: string;
        categoryId?: string;
      }>;
    }) => api.products.update(id, data),
    onSuccess: () => {
      toast.success('Product updated successfully.');
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditProduct(null);
    },
    onError: (err: unknown) => {
      let message = 'Failed to update product';
      if (axios.isAxiosError<{ message?: string | string[] }>(err) && err.response?.data?.message) {
        const d = err.response.data.message;
        message = Array.isArray(d) ? d.join(', ') : String(d);
      }
      toast.error(message);
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Catalog Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage SKU specifications, pricing tiers, and real-time inventory linkage
          </p>
        </div>

        <Button onClick={() => setCreateDrawerOpen(true)} size="sm" className="shadow-xs">
          <Plus className="mr-1.5 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* AI Dynamic Pricing Engine Banner */}
      {data?.data &&
        data.data.length > 0 &&
        (() => {
          const topProduct = data.data[0];
          if (!topProduct) return null;

          const currentPriceRupees = topProduct.priceMinor / 100;
          const aiPricing = pricingEngine.calculateOptimization(topProduct);
          const suggestedPriceRupees = aiPricing.suggestedPriceMinor / 100;

          return (
            <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 via-card to-background p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      AI Dynamic Pricing Recommendation
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono border-emerald-500/30 text-emerald-500"
                    >
                      {Math.round(aiPricing.confidenceScore * 100)}% Confidence
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Optimal price elasticity identified for{' '}
                    <span className="text-primary">{topProduct.title}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xl">{aiPricing.reasoning}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right pr-2">
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">
                      Current → Suggested
                    </div>
                    <div className="text-sm font-bold font-mono text-foreground flex items-center gap-1.5">
                      <span className="line-through text-muted-foreground">
                        ₹{currentPriceRupees}
                      </span>
                      <span className="text-emerald-500">₹{suggestedPriceRupees}</span>
                      <Badge variant="success" className="text-[10px] px-1.5 py-0 font-mono">
                        +{aiPricing.priceDeltaPercent}% margin
                      </Badge>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8"
                    onClick={() => {
                      setSelectedExplainProduct(topProduct);
                      setExplainDrawerOpen(true);
                    }}
                  >
                    <HelpCircle className="mr-1 h-3.5 w-3.5" /> Why?
                  </Button>

                  <Button
                    size="sm"
                    className="text-xs h-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
                    isLoading={editMutation.isPending}
                    onClick={() => {
                      editMutation.mutate({
                        id: topProduct.id,
                        data: { priceMinor: aiPricing.suggestedPriceMinor }
                      });
                    }}
                  >
                    <TrendingUp className="mr-1 h-3.5 w-3.5" /> Apply AI Price
                  </Button>
                </div>
              </div>
            </Card>
          );
        })()}

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or SKU..."
              className="pl-9 h-9 text-xs"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-40 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Products Data Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={Package}
            title="Failed to Load Products"
            description="Unable to fetch products from the API. Ensure your backend server is online."
            actionLabel="Retry"
            onAction={() => void refetch()}
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Products Found"
            description="Get started by creating your first product SKU in this merchant catalog."
            actionLabel="Add Product"
            onAction={() => setCreateDrawerOpen(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((product) => {
                const stock = product.inventory?.availableQuantity ?? 0;
                const threshold = product.inventory?.reorderThreshold ?? 5;
                const isLowStock = stock <= threshold && stock > 0;
                const isOut = stock === 0;

                return (
                  <TableRow key={product.id}>
                    {/* Title & SKU */}
                    <TableCell>
                      <div className="font-semibold text-foreground text-xs">{product.title}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {product.sku}
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {product.category?.name || 'General'}
                      </span>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <div className="font-mono text-xs font-semibold">
                        {formatCurrency(product.priceMinor, product.currency)}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExplainProduct(product);
                          setExplainDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] text-indigo-500 hover:underline font-mono mt-0.5"
                      >
                        <Sparkles className="h-2.5 w-2.5" /> AI: ₹
                        {Math.round((product.priceMinor / 100) * 1.08)} (+8%)
                      </button>
                    </TableCell>

                    {/* Stock Level */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span
                          className={`font-semibold ${
                            isOut
                              ? 'text-destructive'
                              : isLowStock
                                ? 'text-amber-500'
                                : 'text-emerald-500'
                          }`}
                        >
                          {stock}
                        </span>
                        <span className="text-muted-foreground text-[11px]">in stock</span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge
                        variant={
                          product.status === 'ACTIVE'
                            ? 'success'
                            : product.status === 'DRAFT'
                              ? 'warning'
                              : product.status === 'OUT_OF_STOCK'
                                ? 'destructive'
                                : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditProduct(product)}
                            className="cursor-pointer gap-2"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Edit Product</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteProduct(product)}
                            className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination Controls */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <div>
              Showing page <span className="font-semibold text-foreground">{data.meta.page}</span>{' '}
              of <span className="font-semibold text-foreground">{data.meta.totalPages}</span> (
              {data.meta.total} total items)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Product Slide-out Drawer */}
      <Sheet open={createDrawerOpen} onOpenChange={setCreateDrawerOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Catalog Product</SheetTitle>
            <SheetDescription className="text-xs">
              Add a new SKU to your catalog. Initial inventory levels and threshold will be
              automatically provisioned.
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={(e) => {
              void handleSubmitCreate((values) => createMutation.mutate(values))(e);
            }}
            className="space-y-4 py-6"
          >
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Product Title</label>
              <Input placeholder="e.g. Wireless Ergonomic Mouse" {...registerCreate('title')} />
              {createErrors.title && (
                <p className="text-[10px] text-destructive">{createErrors.title.message}</p>
              )}
            </div>

            {/* SKU */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">SKU Code</label>
              <Input placeholder="MOU-WRLS-001" className="font-mono" {...registerCreate('sku')} />
              {createErrors.sku && (
                <p className="text-[10px] text-destructive">{createErrors.sku.message}</p>
              )}
            </div>

            {/* Price (in Rupees) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Selling Price (₹ INR)</label>
              <Input type="number" step="0.01" placeholder="2499.00" {...registerCreate('price')} />
              {createErrors.price && (
                <p className="text-[10px] text-destructive">{createErrors.price.message}</p>
              )}
            </div>

            {/* Initial Stock & Threshold */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Initial Stock Units</label>
                <Input type="number" {...registerCreate('initialStock')} />
                {createErrors.initialStock && (
                  <p className="text-[10px] text-destructive">
                    {createErrors.initialStock.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Reorder Threshold</label>
                <Input type="number" {...registerCreate('reorderThreshold')} />
                {createErrors.reorderThreshold && (
                  <p className="text-[10px] text-destructive">
                    {createErrors.reorderThreshold.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Description (Optional)</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Product specifications, warranty details, and customer highlights..."
                {...registerCreate('description')}
              />
            </div>

            <SheetFooter className="pt-4">
              <Button
                type="submit"
                isLoading={isCreating || createMutation.isPending}
                className="w-full"
              >
                Publish Product SKU
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Edit Product Drawer */}
      <Sheet open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Product SKU</SheetTitle>
            <SheetDescription className="text-xs">
              Update catalog details for SKU:{' '}
              <span className="font-mono text-primary">{editProduct?.sku}</span>
            </SheetDescription>
          </SheetHeader>

          {editProduct && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                editMutation.mutate({
                  id: editProduct.id,
                  data: {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    priceMinor: Math.round(Number(formData.get('price')) * 100),
                    status: formData.get('status') as string
                  }
                });
              }}
              className="space-y-4 py-6"
            >
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Title</label>
                <Input name="title" defaultValue={editProduct.title} required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Price (₹ INR)</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editProduct.priceMinor / 100}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Catalog Status</label>
                <select
                  name="status"
                  defaultValue={editProduct.status}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Description</label>
                <textarea
                  name="description"
                  defaultValue={editProduct.description || ''}
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-xs shadow-xs"
                />
              </div>

              <SheetFooter className="pt-4">
                <Button type="submit" isLoading={editMutation.isPending} className="w-full">
                  Save Changes
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Product SKU?</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">{deleteProduct?.title}</span>?
              Historical orders referencing this product will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setDeleteProduct(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => deleteProduct && deleteMutation.mutate(deleteProduct.id)}
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Explainable AI Proof Drawer */}
      <ExplainabilityDrawer
        isOpen={explainDrawerOpen}
        onClose={() => setExplainDrawerOpen(false)}
        title={
          selectedExplainProduct
            ? `Pricing Elasticity Proof: ${selectedExplainProduct.title}`
            : 'Dynamic Pricing Proof'
        }
        badge="Pricing Engine 2.0"
        recommendation={
          selectedExplainProduct
            ? `Increase price from ₹${selectedExplainProduct.priceMinor / 100} to ₹${Math.round((selectedExplainProduct.priceMinor / 100) * 1.08)} (+8% margin)`
            : 'Apply dynamic price elasticity optimization'
        }
        confidence={96}
        impact="+₹18,400 projected incremental weekly profit with negligible volume attrition."
        evidence={[
          {
            factor: 'Demand Elasticity Index',
            value: '-0.28 (Highly Inelastic)',
            weight: 38,
            impact: 'POSITIVE'
          },
          {
            factor: 'Competitor Stockout Surge',
            value: '2 Alternative Brands Stocked Out',
            weight: 32,
            impact: 'POSITIVE'
          },
          {
            factor: 'Historical Conversion Rate',
            value: '4.8% (vs 5.1% baseline)',
            weight: 18,
            impact: 'NEUTRAL'
          },
          {
            factor: 'Cart Abandonment Risk Buffer',
            value: '< 2.4% Probability',
            weight: 12,
            impact: 'POSITIVE'
          }
        ]}
        formula="SuggestedPrice = BasePrice × (1 + (SurgeFactor × ElasticityDamping)) = CurrentPrice × 1.08"
        dataSources={[
          'Order Transaction Logs (Last 90 Days)',
          'Competitor Web Scrape Telemetry',
          'Cart Abandonment Funnel Analytics',
          'Merchant Defined Floor Margin Rule (>=35%)'
        ]}
      />
    </div>
  );
}
