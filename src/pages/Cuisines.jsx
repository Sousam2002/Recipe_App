import styled from "styled-components";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Cuisines = () => {
  const [cuisines, setCuisines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  let params = useParams();

  useEffect(() => {
    // Use setTimeout to delay the API request by 10 seconds
    const timer = setTimeout(() => {
      getCuisine(params.type);
    }, 5000); // 10 seconds in milliseconds

    // Cleanup the timer if the component unmounts before 10 seconds
    return () => clearTimeout(timer);
  }, [params.type]);

  const getCuisine = async (name) => {
    try {
      const api = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY}&number=9&cuisine=${name}`
      );

      if (!api.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await api.json();
      setCuisines(data.results);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : cuisines.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <Grid
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {cuisines.map((recipe) => {
            return (
              <Card key={recipe.id}>
                <Link to={`/recipeDetails/${recipe.id}`}>
                  <img src={recipe.image} alt={recipe.title} />
                  <h4>{recipe.title}</h4>
                </Link>
              </Card>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 3rem;
`;
const Card = styled.div`
  img {
    width: 100%;
    border-radius: 2rem;
  }
  h4 {
    text-align: center;
    padding: 1rem;
  }
`;

export default Cuisines;
