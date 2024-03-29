import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import {useCookies} from 'react-cookie';

export const Home = () => {

const[recipes,setRecipes] = useState([]);
const[savedRecipes,setSavedRecipes] = useState([]);
const userID = useGetUserID();
const[cookies,_]=useCookies(["access_token"])

useEffect(()=>{
  const fetchRecipes=async()=>{
 try{
  const response = await axios.get("http://localhost:3001/recipes");
 setRecipes(response.data);
    console.log(recipes,"hhh")
}catch(err){
  console.error(err);
}
};

const fetchSavedRecipes=async()=>{
  try{
    const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
  setSavedRecipes(response.data.savedRecipes);
     console.log(savedRecipes)
 }catch(err){
   console.error(err);
 }
 };
 
fetchRecipes();
if(cookies.access_token) fetchSavedRecipes();

},[]);

const saveRecipe = async (recipeID) => {
  try {
    const response = await axios.put("http://localhost:3001/recipes", {
      recipeID,
      userID,
    },{headers:{authorization: cookies.access_token}});
    setSavedRecipes(response.data.savedRecipes);
    console.log(response.data.savedRecipes)
  } catch (err) {
    console.log(err);
  }
};

//const isRecipeSaved = (id) => savedRecipes.includes(id);

const isRecipeSaved = (id) => {
  if (savedRecipes && savedRecipes.length > 0) {
    return savedRecipes.includes(id);
  }
  return false;
};


  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

