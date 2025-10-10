"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";
import { useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCookie } from "cookies-next";

interface Product {
  ID: string;
  Name: string;
  Description: string;
  Category: string;
  Price: number;
  SKU: string;
  IsActive: boolean;
  StoreID: string;
  CreatedAt: string;
  UpdatedAt: string;
  images: {
    ID: string;
    URL: string;
    AltText: string;
    IsPrimary: boolean;
    ProductID: string;
  }[];
}

interface ProductsListProps {
  products: Product[];
  onProductDeleted?: () => void;
  searchQuery: string;
  priceRange: {
    min: number;
    max: number;
  } | null;
}

export function ProductsList({ products, onProductDeleted, searchQuery, priceRange }: ProductsListProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = searchQuery
          ? product.Name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesPrice = priceRange
          ? product.Price >= priceRange.min && product.Price <= priceRange.max
          : true;

        return matchesSearch && matchesPrice;
      })
      .sort((a, b) => a.Name.localeCompare(b.Name));
  }, [products, searchQuery, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    try {
      const token = getCookie("better-auth.jwt");
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`/api/products/${selectedProduct.ID}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      toast.success('Product deleted successfully');
      onProductDeleted?.();
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error instanceof Error && error.message.includes('404')) {
        toast.error('Product not found');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete product');
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <Card className="rounded-none sm:rounded-lg border-x-0 sm:border-x">
      <Toaster position="top-right" expand={true} richColors />
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[100px]">Price</TableHead>
                <TableHead className="min-w-[100px]">Category</TableHead>
                <TableHead className="min-w-[100px]">SKU</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.ID}>
                  <TableCell>
                    <div className="relative h-16 w-24 overflow-hidden rounded-md">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images.find(img => img.IsPrimary)?.URL || product.images[0].URL}
                          alt={product.images.find(img => img.IsPrimary)?.AltText || product.Name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 96px) 100vw, 96px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div 
                      className="flex flex-col cursor-pointer hover:text-primary transition-colors"
                      onClick={() => router.push(`/store-management/products/${product.ID}`)}
                    >
                      <span className="font-medium">{product.Name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.Price.toFixed(2)}dh</TableCell>
                  <TableCell className="capitalize">{product.Category}</TableCell>
                  <TableCell>{product.SKU}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.IsActive ? "default" : "secondary"}
                      className={product.IsActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {product.IsActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(`/store-management/products/${product.ID}`)}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/store-management/products/${product.ID}/edit`)}
                        >
                          Edit product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(product)}
                        >
                          Delete product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              {selectedProduct && ` "${selectedProduct.name}"`} and remove all its data
              from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}