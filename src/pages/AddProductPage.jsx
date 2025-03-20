import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useToast } from '../hooks/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import axios from "axios";

const AddProductPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast()
  const formRef = useRef(null);
  const [vendorId, setVendorId] = useState(null); // Store vendor ID
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Save the selected file
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

 
    // Basic validation
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (formData.price < 0 || formData.stock < 0) {
      setError("Price and stock cannot be negative.");
      setLoading(false);
      return;
    }
    const storedVendor = JSON.parse(localStorage.getItem("urbanhive_user")); // Assuming vendor info is stored as JSON
   

    // Prepare form data for file upload
    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("vendor", vendorId); // Auto-filled vendor ID
    productFormData.append("price", formData.price);
    productFormData.append("category", formData.category);
    productFormData.append("description", formData.description);
    productFormData.append("image", formData.image)
    productFormData.append("id", storedVendor._id); // Add the image file

    try {
      // Send the product data to the backend
      const response = await axios.post("http://localhost:5000/api/vendors/add-product", productFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast({
          title: 'product added successfully!!',
        })
        if (formRef.current) {
          formRef.current.reset();
        }
        navigate("/vendor/add-product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Add Product</CardTitle>
            <CardDescription>Enter product details and upload an image.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="enter the desription"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
{/* 
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-center text-gray-500">
            <p>All fields are required, including the product image.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AddProductPage;
