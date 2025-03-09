import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const VendorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
    address: "",
    latitude: "",
    longitude: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    setFormData({ ...formData, latitude: lat, longitude: lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/vendors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Vendor registered successfully!");
      navigate("/vendor/login");
    } catch (error) {
      setError(error.message);
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
                <Button type="button" onClick={handleLocationFetch}>Get Location</Button>
                <Button type="button" onClick={() => setMapOpen(true)}>Select Location</Button>
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

      {mapOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-[90%] max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Select Your Shop Location</h3>
            <LoadScript googleMapsApiKey="AIzaSyBc6pB3CoIZLR4wCVNxV4_vWK1ZNH_YsuU">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "300px" }}
                center={selectedLocation || { lat: 12.9716, lng: 77.5946 }}
                zoom={15}
                onClick={handleMapClick}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            </LoadScript>
            <div className="flex justify-end mt-3">
              <Button onClick={() => setMapOpen(false)}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRegistration;
