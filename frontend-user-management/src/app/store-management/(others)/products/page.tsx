"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductsList } from "~/components/store-management/product/product-list";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Toaster, toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useSession } from "~/lib/auth-client";
import { getCookie } from "cookies-next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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

interface ApiResponse {
  success: boolean;
  data: Product[];
}

interface PriceRange {
  label: string;
  value: string;
  min?: number;
  max?: number;
}

const PRICE_RANGES: PriceRange[] = [
  { label: "All Prices", value: "all" },
  { label: "0-250dh", value: "0-250dh", min: 0, max: 250 },
  { label: "251-500dh", value: "251-500dh", min: 251, max: 500 },
  { label: "501-1000dh", value: "501-1000dh", min: 501, max: 1000 },
  { label: "+1000dh", value: "+1000dh", min: 1001, max: 99999 },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");

  const fetchProducts = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = getCookie("better-auth.jwt");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${session.user.id}/stores`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      if (data && Array.isArray(data)) {
        setProducts(data);
      } else if (data && data.data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    const newProductAdded = searchParams.get('newProduct');
    if (newProductAdded === 'true') {
      toast.success('New product added successfully');
    }
  }, [searchParams]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const handleProductDeleted = () => {
    void fetchProducts();
  };

  const handleAddProduct = () => {
    router.push('/store-management/products/add');
  };

  const handlePriceRangeChange = (value: string) => {
    setSelectedPriceRange(value);
  };

  const getPriceRangeValues = () => {
    const range = PRICE_RANGES.find(range => range.value === selectedPriceRange);
    if (!range || !range.min || !range.max) return null;
    return { min: range.min, max: range.max };
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Please sign in to view products</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Products Management</h1>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mt-2">
            Manage your product inventory and details.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="sm:p-1">
            <CardHeader className="pb-1 sm:pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{products.length}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Products in inventory</p>
            </CardContent>
          </Card>

          <Card className="sm:p-1">
            <CardHeader className="pb-1 sm:pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">In Stock</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">
                {products.filter(product => product.quantity > 0).length}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Available products</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1 sm:p-1">
            <CardHeader className="pb-1 sm:pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Average Price</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">
                {(products.reduce((acc, product) => acc + product.price, 0) / products.length || 0).toFixed(2)}DH
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Per product</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleAddProduct} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Search Products</Label>
            <Input
              id="search"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="price-range">Price Range</Label>
            <Select value={selectedPriceRange} onValueChange={handlePriceRangeChange}>
              <SelectTrigger id="price-range" className="max-w-sm">
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="-mx-4 sm:mx-0">
          <ProductsList 
            products={products} 
            onProductDeleted={handleProductDeleted}
            searchQuery={searchQuery}
            priceRange={getPriceRangeValues()}
          />
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>Product data is updated in real-time. Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
