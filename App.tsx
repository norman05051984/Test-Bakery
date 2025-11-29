import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Ingredients from './components/Ingredients';
import Recipes from './components/Recipes';
import { ViewState, Ingredient, Recipe } from './types';
import { MOCK_INGREDIENTS, MOCK_RECIPES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Lifted state for data persistence across tabs
  const [ingredients, setIngredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);

  const handleAddIngredient = (ing: Ingredient) => {
    setIngredients([...ingredients, ing]);
  };
  
  const handleUpdateIngredient = (updatedIng: Ingredient) => {
    setIngredients(ingredients.map(ing => ing.id === updatedIng.id ? updatedIng : ing));
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const handleAddRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe]);
    setCurrentView(ViewState.RECIPES);
  };
  
  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            ingredients={ingredients} 
            recipes={recipes} 
            onNavigate={setCurrentView}
            onNewRecipe={() => setCurrentView(ViewState.RECIPES)}
            onNewIngredient={() => setCurrentView(ViewState.INGREDIENTS)}
          />
        );
      case ViewState.INGREDIENTS:
        return (
          <Ingredients 
            ingredients={ingredients} 
            recipes={recipes}
            onAdd={handleAddIngredient}
            onUpdate={handleUpdateIngredient}
            onDelete={handleDeleteIngredient}
          />
        );
      case ViewState.RECIPES:
        return (
          <Recipes 
            recipes={recipes} 
            ingredients={ingredients} 
            onAddRecipe={handleAddRecipe}
            onUpdateRecipe={handleUpdateRecipe}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-400">
             Feature under development
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        
        <main className="flex-1 overflow-auto p-8 mt-16 scroll-smooth">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;