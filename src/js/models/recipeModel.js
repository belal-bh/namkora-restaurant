import { v4 as uuidv4 } from "uuid";
import { state } from "./model";
import { recipesStorageKey } from "./storageKeys";
import { SPINNER_WAIT_SEC } from "./../config";
import { wait } from "../helpers";

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

Recipe.prototype.save = function () {
  const recipe = getRecipe(this.id);
  if (!recipe) {
    // new recipe
    state.recipes.push(this);
  } else {
    // Same recipe. Early return
    if (recipe === this) return this;

    // update recipe and save
    recipe.title = this.title;
    recipe.publisher = this.publisher;
    recipe.sourceUrl = this.sourceUrl;
    recipe.image = this.image;
    recipe.servings = this.servings;
    recipe.cookingTime = this.cookingTime;
    recipe.ingredients = this.ingredients;
  }

  // synce to local storage
  persistRecipes();
  return this;
};

export const isValidRecipeId = function (id) {
  if (getRecipe(id)) return true;
  return false;
};

export const getRecipe = (id) => {
  for (let i = 0; i < state.recipes.length; i++) {
    if (state.recipes[i].id === id) return state.recipes[i];
  }
  return false;
};

export const searchRecipeByTitle = async function (query) {
  const keywords = query.split(/[,\s]\s*/).reduce((prev, curr) => {
    curr = curr.trim();
    if (curr) {
      prev.push(curr.toLowerCase());
    }
    return prev;
  }, []);
  // console.log(keywords);
  const res = [];
  state.recipes.forEach((recipe, index) => {
    let i = 0;
    let m;
    while (i < keywords.length) {
      // let regex = new RegExp(`(${keywords[i]})`, "i"); // do not get expected result

      let regex = new RegExp(`\\b(${keywords[i]})\\b`, "i"); // N.B: Use dubble slash (\\)

      m = regex.test(recipe.title);
      // console.log("m=", m);
      if (m) {
        res.push(recipe);
        break;
      }
      i++;
    }
  });

  // console.log("res", res);
  return res;
};

const createRecipeObject = function (recipe) {
  const recipeData = { ...recipe };
  // console.log(recipeData);
  return new Recipe(recipeData);
};

export const loadRecipe = async function (id) {
  try {
    const recipe = getRecipe(id);
    state.recipe = recipe;

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe);

    const ingredients = newRecipe.ingredients.map((ing) => {
      return {
        quantity: ing.quantity ? +ing.quantity : null,
        unit: ing.unit,
        description: ing.description,
      };
    });
    const today = new Date();

    const recipeData = {
      id: uuidv4(),
      user: state.loggedInUser.username ? state.loggedInUser.username : null,
      createdAt: today.toISOString(),
      title: newRecipe.title,
      sourceUrl: newRecipe.sourceUrl,
      image: newRecipe.image,
      publisher: newRecipe.publisher,
      cookingTime: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log("recipe", recipeData);
    const recipe = createRecipeObject(recipeData);

    console.log("recipe", recipe);

    // update recipe states
    state.recipe = recipe;

    const savedRecipe = recipe.save();

    await wait(SPINNER_WAIT_SEC);

    persistRecipes();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    const ingredientListInitial = [];
    const ingredients = newRecipe.ingredients.reduce((ingredientList, ing) => {
      if (ing?.quantity && ing?.description)
        ingredientList.push({
          quantity: +ing.quantity,
          unit: ing.unit,
          description: ing.description,
        });
      return ingredientList;
    }, ingredientListInitial);
    const recipe = getRecipe(newRecipe?.id ? newRecipe.id : state.recipe.id);

    // Update recipe data
    recipe.title = newRecipe.title;
    recipe.sourceUrl = newRecipe.sourceUrl;
    recipe.image = newRecipe.image;
    recipe.publisher = newRecipe.publisher;
    recipe.cookingTime = +newRecipe.cookingTime;
    recipe.servings = +newRecipe.servings;
    recipe.ingredients = ingredients;

    // console.log("recipe", recipe);

    // update recipe states
    state.recipe = recipe;

    const savedRecipe = recipe.save();

    await wait(SPINNER_WAIT_SEC);

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
