import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importing AuthContext
import { useToast } from "../hooks/use-toast"; // Assuming toast hook for feedback

const VendorRegistration = () => {
  const navigate = useNavigate();
  const { registerVendor } = useAuth();  // Using the registerVendor function from AuthContext
  const { toast } = useToast();  // Using the toast hook for feedback
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    storeName: "",
    storeAddress: "",
    latitude: "",
    longitude: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError("");
      },
      (error) => {
        setError("Failed to retrieve location. Please enable GPS.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await registerVendor(formData);  // Use registerVendor from AuthContext

     
       
      
    } catch (error) {
      setError(error.message || "An error occurred while registering.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent>
          <h2 className="text-xl font-semibold text-center mb-4">Vendor Registration</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) =>
              field !== "latitude" && field !== "longitude" && (
                <div key={field}>
                  <Label htmlFor={field} className="block text-sm font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    type={field === "password" ? "password" : "text"}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              )
            )}

            <div>
              <Label className="block text-sm font-medium">Shop Location</Label>
              <div className="flex gap-2">
                <Button type="button" onClick={handleLocationFetch}>
                  Get Location
                </Button>
              </div>
              {formData.latitude && formData.longitude && (
                <p className="text-sm text-green-600">
                  Location: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorRegistration;
