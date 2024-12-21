"use client";

import { useState, useEffect } from "react";

export default function RecipePage() {
  const [dishName, setDishName] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setRecipe(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishName }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecipe(data.recipe);
      } else {
        setMessage(data.message || "An unknown error occurred");
        setRecipe(null);
      }
    } catch (err) {
      setError(err.message);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="recipe-container">
      <h1>Recipe Generator</h1>
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="input-group">
          <label htmlFor="dishName">Enter Dish Name</label>
          <input
            type="text"
            id="dishName"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            required
            placeholder="e.g., Spaghetti Carbonara"
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="error-message">{message}</p>}

      {recipe && !message && (
        <div className="recipe-output">
          <h2>{recipe.recipeName}</h2>
          <h3>Dish Name: {recipe.dishName}</h3>
          <h3>Ingredients:</h3>
          <ul className="ingredients-list">
            {recipe.ingredients?.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h3>Steps:</h3>
          <ol className="steps-list">
            {recipe.steps?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
