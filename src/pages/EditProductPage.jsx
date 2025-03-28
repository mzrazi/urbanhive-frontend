import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useToast } from '../hooks/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import axios from "axios";

const EditProductPage = () => {
  const { productId } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vendors/getproduct/${productId}`);
        const product = response.data.product;
        console.log(response);
        

        setFormData({
          name: product.name || "",
          price: product.price || 0,
          category: product.category || "",
          description: product.description || "",
          image: product.image || null, // Keep the existing image
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product details.");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Update image only if a new one is selected
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

    if (!formData.name || !formData.price || !formData.category) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const updatedProductData = new FormData();
    updatedProductData.append("name", formData.name);
    updatedProductData.append("price", formData.price);
    updatedProductData.append("category", formData.category);
    updatedProductData.append("description", formData.description);
    if (formData.image instanceof File) {
      updatedProductData.append("image", formData.image); // Add new image if updated
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/vendors/update-product/${productId}`, updatedProductData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast({ title: "Product updated successfully!" });
        navigate(`/vendor/products`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
            <CardDescription>Modify the product details below.</CardDescription>
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                {formData.image && typeof formData.image === "string" && (
                  <img src={`http://localhost:5000${formData.image}`} alt="Product" className="w-24 h-24 object-cover rounded-md mb-2" />
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="text-sm text-gray-500">Upload a new image to replace the current one.</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Product"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-center text-gray-500">
            <p>Make sure to update all necessary details.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EditProductPage;
