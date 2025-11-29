import React from 'react';
import { ArrowRight, Video, MessageCircle } from 'lucide-react';
import { Ingredient, Recipe, ViewState, Unit } from '../types';

interface DashboardProps {
  ingredients: Ingredient[];
  recipes: Recipe[];
  onNavigate: (view: ViewState) => void;
  onNewRecipe: () => void;
  onNewIngredient: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ ingredients, recipes, onNavigate, onNewRecipe, onNewIngredient }) => {
  // Logic to find action items
  const unusedIngredients = ingredients.filter(ing => 
    !recipes.some(r => r.ingredients.some(ri => ri.ingredientId === ing.id))
  ).length;

  const missingSupplier = ingredients.filter(ing => !ing.supplier || ing.supplier === 'General').length;

  // Calculate recipes with low margins (< 65%)
  const lowMarginRecipes = recipes.filter(r => {
    // Calculate total cost
    const totalIngredientCost = r.ingredients.reduce((sum, ri) => {
      const ing = ingredients.find(i => i.id === ri.ingredientId);
      if (!ing) return sum;
      
      // Cost = Price / (CaseQty * PackSize)
      const totalQuantity = (ing.caseQty || 1) * ing.quantitySize;
      let costPerUnit = ing.cost / totalQuantity;
      
      // Basic unit conversion logic
      if (ing.unit === Unit.KG && ri.unit === Unit.G) costPerUnit = costPerUnit / 1000;
      else if (ing.unit === Unit.L && ri.unit === Unit.ML) costPerUnit = costPerUnit / 1000;
      
      return sum + (costPerUnit * ri.quantity);
    }, 0);

    const totalCost = totalIngredientCost + r.laborCost;
    const costPerItem = r.yieldCount > 0 ? totalCost / r.yieldCount : 0;
    const margin = r.salePrice > 0 ? ((r.salePrice - costPerItem) / r.salePrice) * 100 : 0;

    return margin < 65;
  }).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Intro Video Pill */}
      <div className="flex justify-end">
        <a 
          href="https://vimeo.com/user16953913" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white border border-gray-300 text-gray-700 text-sm py-1.5 px-3 rounded shadow-sm hover:bg-gray-50 flex items-center transition-colors"
        >
          <Video className="w-4 h-4 mr-2 text-blue-500" />
          Introduction (6:06)
        </a>
      </div>

      {/* Welcome & Stats */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand mb-2">Good Morning, Chef.</h1>
          <p className="text-gray-600">Here's what's happening in your account today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Ingredient Count</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-slate-800">{ingredients.length}</span>
              <button 
                onClick={onNewIngredient}
                className="mb-1 text-sm bg-white border border-brand text-brand py-1 px-3 rounded hover:bg-sky-50 transition-colors"
              >
                New Ingredient
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Recipe Count</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-slate-800">{recipes.length}</span>
              <button 
                onClick={onNewRecipe}
                className="mb-1 text-sm bg-white border border-brand text-brand py-1 px-3 rounded hover:bg-sky-50 transition-colors"
              >
                New Recipe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-lg text-slate-800">Action Items</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {unusedIngredients > 0 && (
            <div className="p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-sky-500 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-bold text-slate-900">{unusedIngredients} ingredients</span> aren't being used in any recipes
                </p>
              </div>
              <button 
                onClick={() => onNavigate(ViewState.INGREDIENTS)}
                className="text-brand font-medium text-sm flex items-center hover:underline"
              >
                View Ingredients <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          {missingSupplier > 0 && (
            <div className="p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-sky-500 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-bold text-slate-900">{missingSupplier} ingredients</span> without detailed supplier details
                </p>
              </div>
              <button 
                onClick={() => onNavigate(ViewState.INGREDIENTS)}
                className="text-brand font-medium text-sm flex items-center hover:underline"
              >
                View Ingredients <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

           {lowMarginRecipes > 0 && (
             <div className="p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-bold text-slate-900">Review Pricing</span>: {lowMarginRecipes} recipes have low margins (&lt; 65%)
                </p>
              </div>
              <button 
                onClick={() => onNavigate(ViewState.RECIPES)}
                className="text-brand font-medium text-sm flex items-center hover:underline"
              >
                View Recipes <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
           )}

           {unusedIngredients === 0 && missingSupplier === 0 && lowMarginRecipes === 0 && (
             <div className="p-8 text-center text-gray-500">
               Great job! No pending action items.
             </div>
           )}
        </div>
      </div>
       
      {/* Floating Feedback Button Mockup */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-brand text-white p-3 rounded-full shadow-lg hover:bg-sky-700 transition-colors">
           <MessageCircle className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};

export default Dashboard;