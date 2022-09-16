import { v4 as uuidv4 } from "uuid";
import { state } from "./model";
import { recipesStorageKey } from "./storageKeys";

export class Recipe {
  id;
  user;
  createdAt;
  title;
  publisher;
  sourceUrl;
  image;
  servings;
  cookingTime;
  ingredients;

  constructor(recipeData) {
    this.id = recipeData?.id ? recipeData?.id : uuidv4();
    this.user = recipeData?.user
      ? recipeData.user
      : state.loggedInUser.username;
    this.createdAt = recipeData?.createdAt
      ? recipeData?.createdAt
      : new Date().toISOString();
    this.title = recipeData?.title ? recipeData?.title : "";
    this.publisher = recipeData?.publisher ? recipeData?.publisher : "";
    this.sourceUrl = recipeData?.sourceUrl ? recipeData?.sourceUrl : "";
    this.image = recipeData?.image ? recipeData?.image : "";
    this.servings = recipeData?.servings ? recipeData?.servings : null;
    this.cookingTime = recipeData?.cookingTime ? recipeData?.cookingTime : null;
    this.ingredients = recipeData?.ingredients ? recipeData?.ingredients : [];
  }
}

const createRecipeObject = function (recipe) {
  const recipeData = {
    id: recipe.id,
    user: recipe.user,
    createdAt: recipe.created_at,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
  console.log(recipeData);
  return new Recipe(recipeData);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);

    const ingredients = newRecipe.ingredients.map((ing) => {
      return {
        quantity: ing.quantity ? +ing.quantity : null,
        unit: ing.unit,
        description: ing.description,
      };
    });
    const today = new Date();

    const recipe = {
      id: uuidv4(),
      user: state.loggedInUser.username ? state.loggedInUser.username : null,
      created_at: today.toISOString(),
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log("recipe", recipe);
    const recipeCreated = createRecipeObject(recipe);

    console.log("recipeCreated", recipeCreated);

    // update recipe states
    state.recipe = recipeCreated;
    state.recipes.push(recipeCreated);

    persistRecipes();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const persistRecipes = () => {
  localStorage.setItem(recipesStorageKey, JSON.stringify(state.recipes));
};

export const parseRecipe = (recipeData) => {
  try {
    // TODO: Implement logic
    const recipe = new Recipe(recipeData);
    return recipe;
  } catch (err) {
    throw err;
  }
};

export const parseRecipesFromJSON = (storage) => {
  if (!storage) return [];
  const initialRecipes = [];
  const recipeList = JSON.parse(storage).reduce((recipes, recipeData) => {
    try {
      const recipe = parseRecipe(recipeData);
      recipes.push(recipe);
      return recipes;
    } catch (err) {
      console.log(`IGNORING recipe: ${err}`);
    }
  }, initialRecipes);

  return recipeList;
};
