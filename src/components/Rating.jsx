import { useState } from "react";
import axios from "axios";
import { useToast } from '../hooks/use-toast'

const Rating = ({ rating, orderId }) => {
  const [newRating, setNewRating] = useState(rating);
  const {toast}=useToast();

  // Function to handle when the user selects a new rating
  const handleRatingChange = async (newRating) => {
    setNewRating(newRating);
    
    try {
      // Call API to update the rating
      const response = await axios.put("http://localhost:5000/api/users/order-rating", {
        orderId: orderId,
        rating: newRating,
      });

      if (response.status === 200) {
        toast({
            title: 'rating successful',
            description: `thank you!!`,
          })
      }
    } catch (error) {
      console.log("Error saving rating", error);
      toast({
        title: 'rating failed',
        variant:"destructive"
      })
    }
  };

  return (
    <div>
      <p>Rate your order:</p>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(star)}
            style={{
              color: star <= newRating ? "yellow" : "gray",
            }}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

export default Rating;
