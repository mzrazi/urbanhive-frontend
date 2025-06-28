import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useToast } from '../hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";

const ComplaintPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!description.trim()) {
      setError("Please enter a complaint description.");
      setLoading(false);
      return;
    }

    try {
        const userData = localStorage.getItem("urbanhive_user");
        if (!userData) return console.warn("User not logged in");
  
        const user = JSON.parse(userData);
        if (!user.id) return console.warn("Invalid user data");
  
      const response = await axios.post(
        "http://localhost:5000/api/users/complaint",
        { description ,id:user.id}
      );

      if (response.status === 201) {
        toast({ title: "Complaint raised successfully!" });
        setDescription("");
        navigate("/complaint"); // Redirect to complaints list (optional)
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setError("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Raise a Complaint</CardTitle>
            <CardDescription>Describe the issue you are facing.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="space-y-2">
                <Label htmlFor="description">Complaint Description</Label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter your complaint details"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Complaint"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-center text-gray-500">
            <p>Our team will review your complaint and update the status.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintPage;
