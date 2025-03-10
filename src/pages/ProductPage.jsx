import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ShoppingCart, Filter, Search } from "lucide-react";

const products = [
  { id: 1, name: "Fresh Apples", price: 200, image: "https://via.placeholder.com/150", vendor: "Green Mart" },
  { id: 2, name: "Organic Rice", price: 500, image: "https://via.placeholder.com/150", vendor: "Farm Fresh" },
  { id: 3, name: "Dairy Milk", price: 100, image: "https://via.placeholder.com/150", vendor: "Daily Dairy" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Search and Filter Section */}
      {/* <div className="flex justify-between mb-4 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Search for products..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setFilter("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("Lowest Price")}>Lowest Price</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("Highest Price")}>Highest Price</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-4 flex flex-col gap-2">
            <img src={product.image} alt={product.name} className="rounded-lg" />
            <CardContent className="p-2">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.vendor}</p>
              <p className="text-xl font-bold mt-1">₹{product.price}</p>
              <Button className="mt-2 w-full flex items-center gap-2">
                <ShoppingCart size={16} /> Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
