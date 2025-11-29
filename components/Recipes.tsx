import React, { useState } from 'react';
import { Recipe, Ingredient, Unit, RecipeIngredient } from '../types';
import { Plus, ChevronDown, ChevronRight, Wand2, Loader2, X, Edit2 } from 'lucide-react';
import { generateRecipeIngredients } from '../services/geminiService';

interface RecipesProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  onAddRecipe: (r: Recipe) => void;
  onUpdateRecipe: (r: Recipe) => void;
}

const Recipes: React.FC<RecipesProps> = ({ recipes, ingredients, onAddRecipe, onUpdateRecipe }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Creation/Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [newRecipeYield, setNewRecipeYield] = useState(12);
  const [newRecipeSalePrice, setNewRecipeSalePrice] = useState(0);
  const [newRecipeLabor, setNewRecipeLabor] = useState(10);
  
  // AI State
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to calculate cost
  const calculateTotalCost = (recipeIngredients: RecipeIngredient[]) => {
    return recipeIngredients.reduce((total, ri) => {
      const ing = ingredients.find(i => i.id === ri.ingredientId);
      if (!ing) return total;
      
      const totalQuantity = (ing.caseQty || 1) * ing.quantitySize;
      let costPerUnit = ing.cost / totalQuantity;
      
      // Basic unit conversion logic
      if (ing.unit === Unit.KG && ri.unit === Unit.G) costPerUnit = costPerUnit / 1000;
      if (ing.unit === Unit.L && ri.unit === Unit.ML) costPerUnit = costPerUnit / 1000;
      
      return total + (costPerUnit * ri.quantity);
    }, 0);
  };

  const handleSmartFill = async () => {
    if (!newRecipeName) return;
    setIsGenerating(true);
    try {
      const suggestions = await generateRecipeIngredients(newRecipeName);
      const mappedIngredients: RecipeIngredient[] = [];
      suggestions.forEach(s => {
        const match = ingredients.find(i => i.name.toLowerCase().includes(s.name.toLowerCase()));
        if (match) {
          mappedIngredients.push({
            ingredientId: match.id,
            quantity: s.estimatedQuantity,
            unit: s.unit as Unit || match.unit
          });
        }
      });
      setNewRecipeIngredients(mappedIngredients);
    } catch (err) {
      alert("Failed to generate recipe. Please try again or fill manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startEdit = (e: React.MouseEvent, r: Recipe) => {
    e.stopPropagation();
    setEditingId(r.id);
    setNewRecipeName(r.name);
    setNewRecipeIngredients([...r.ingredients]);
    setNewRecipeYield(r.yieldCount);
    setNewRecipeSalePrice(r.salePrice);
    setNewRecipeLabor(r.laborCost);
    setIsCreating(true);
  };

  const handleSaveRecipe = () => {
    if(!newRecipeName) return;
    const recipe: Recipe = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: newRecipeName,
      ingredients: newRecipeIngredients,
      yieldCount: newRecipeYield,
      salePrice: newRecipeSalePrice,
      laborCost: newRecipeLabor,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    if (editingId) {
      onUpdateRecipe(recipe);
    } else {
      onAddRecipe(recipe);
    }
    
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setNewRecipeName('');
    setNewRecipeIngredients([]);
    setNewRecipeYield(12);
    setNewRecipeSalePrice(0);
    setNewRecipeLabor(10);
  };

  const addIngredientRow = () => {
    if(ingredients.length > 0) {
        setNewRecipeIngredients([...newRecipeIngredients, { ingredientId: ingredients[0].id, quantity: 0, unit: ingredients[0].unit }]);
    }
  };

  const updateIngredientRow = (index: number, field: keyof RecipeIngredient, value: any) => {
      const updated = [...newRecipeIngredients];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'ingredientId') {
          const ing = ingredients.find(i => i.id === value);
          if (ing) updated[index].unit = ing.unit;
      }
      setNewRecipeIngredients(updated);
  };
  
  const removeIngredientRow = (index: number) => {
      const updated = [...newRecipeIngredients];
      updated.splice(index, 1);
      setNewRecipeIngredients(updated);
  }

  const currentTotalCost = calculateTotalCost(newRecipeIngredients) + newRecipeLabor;
  const currentCostPerItem = newRecipeYield > 0 ? currentTotalCost / newRecipeYield : 0;
  const currentMargin = newRecipeSalePrice > 0 ? ((newRecipeSalePrice - currentCostPerItem) / newRecipeSalePrice) * 100 : 0;

  const inputStyle = "w-full border border-slate-300 bg-slate-50 p-2.5 rounded focus:ring-1 focus:ring-brand focus:bg-white outline-none text-slate-700 placeholder-slate-400 shadow-sm transition-colors";

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden pb-12">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Recipe' : 'New Recipe Calculator'}</h2>
          <button onClick={() => { setIsCreating(false); resetForm(); }} className="text-gray-500 hover:text-gray-700">
             <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-4 items-end">
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-600 mb-1.5">Recipe Name</label>
               <input 
                  type="text" 
                  value={newRecipeName}
                  onChange={(e) => setNewRecipeName(e.target.value)}
                  placeholder="e.g. Strawberry Cheesecake"
                  className={inputStyle}
               />
             </div>
             {!editingId && (
               <button 
                  onClick={handleSmartFill}
                  disabled={isGenerating || !newRecipeName}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-md font-medium flex items-center disabled:opacity-50 transition-colors shadow-sm"
               >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
                  Smart Fill with AI
               </button>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Batch Yield (Items)</label>
              <input type="number" value={newRecipeYield} onChange={(e) => setNewRecipeYield(Number(e.target.value))} className="w-full border border-slate-300 bg-white rounded p-2 text-slate-700 focus:ring-1 focus:ring-brand outline-none" />
            </div>
            <div>
               <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Labor Cost (Total)</label>
               <div className="relative">
                 <span className="absolute left-3 top-2 text-slate-500 font-medium">RM</span>
                 <input type="number" value={newRecipeLabor} onChange={(e) => setNewRecipeLabor(Number(e.target.value))} className="w-full border border-slate-300 bg-white rounded p-2 pl-10 text-slate-700 focus:ring-1 focus:ring-brand outline-none" />
               </div>
            </div>
             <div>
               <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Target Sale Price (Each)</label>
               <div className="relative">
                 <span className="absolute left-3 top-2 text-slate-500 font-medium">RM</span>
                 <input type="number" step="0.1" value={newRecipeSalePrice} onChange={(e) => setNewRecipeSalePrice(Number(e.target.value))} className="w-full border border-slate-300 bg-white rounded p-2 pl-10 text-slate-700 focus:ring-1 focus:ring-brand outline-none" />
               </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="font-semibold text-slate-700">Ingredients</h3>
               <button onClick={addIngredientRow} className="text-sm text-brand font-medium hover:underline">+ Add Ingredient</button>
            </div>
            <div className="border border-slate-200 rounded-md overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600">
                        <tr>
                            <th className="p-3 font-semibold">Ingredient</th>
                            <th className="p-3 w-32 font-semibold">Quantity</th>
                            <th className="p-3 w-24 font-semibold">Unit</th>
                            <th className="p-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {newRecipeIngredients.map((ri, idx) => (
                            <tr key={idx} className="bg-white">
                                <td className="p-2">
                                    <select 
                                        className="w-full border-none bg-transparent focus:ring-0 text-slate-700"
                                        value={ri.ingredientId}
                                        onChange={(e) => updateIngredientRow(idx, 'ingredientId', e.target.value)}
                                    >
                                        {ingredients.map(ing => (
                                            <option key={ing.id} value={ing.id}>{ing.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2">
                                    <input 
                                        type="number" 
                                        className="w-full border border-slate-300 rounded p-1.5 text-slate-700 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand outline-none"
                                        value={ri.quantity}
                                        onChange={(e) => updateIngredientRow(idx, 'quantity', Number(e.target.value))}
                                    />
                                </td>
                                <td className="p-2 text-slate-500">{ri.unit}</td>
                                <td className="p-2 text-center">
                                    <button onClick={() => removeIngredientRow(idx)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50">
                                        <X className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 border-t border-slate-200 pt-6">
             <div className="text-center">
                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Cost</div>
                <div className="text-xl font-bold text-slate-800">RM {currentTotalCost.toFixed(2)}</div>
             </div>
             <div className="text-center">
                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Cost Per Item</div>
                <div className="text-xl font-bold text-slate-800">RM {currentCostPerItem.toFixed(2)}</div>
             </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Net Profit</div>
                <div className="text-xl font-bold text-green-600">RM {(newRecipeSalePrice - currentCostPerItem).toFixed(2)}</div>
             </div>
             <div className="text-center">
                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Margin</div>
                <div className={`text-xl font-bold ${currentMargin < 65 ? 'text-red-500' : 'text-green-600'}`}>
                    {currentMargin.toFixed(1)}%
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => { setIsCreating(false); resetForm(); }} className="px-5 py-2 text-slate-600 hover:bg-gray-100 rounded font-medium transition-colors">Cancel</button>
              <button onClick={handleSaveRecipe} className="px-5 py-2 bg-brand text-white rounded font-medium hover:bg-sky-700 shadow-sm transition-colors">
                {editingId ? 'Update Recipe' : 'Save Recipe'}
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Recipes</h1>
           <p className="text-gray-500 text-sm mt-1">Manage your menu items and analyze profitability.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsCreating(true); }}
          className="bg-brand hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Recipe
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {recipes.map(recipe => {
          const totalCost = calculateTotalCost(recipe.ingredients) + recipe.laborCost;
          const costPerItem = totalCost / recipe.yieldCount;
          const margin = ((recipe.salePrice - costPerItem) / recipe.salePrice) * 100;
          const isExpanded = expandedId === recipe.id;

          return (
            <div key={recipe.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
              >
                 <div className="flex items-center gap-4">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{recipe.name}</h3>
                        <p className="text-xs text-gray-500">Updated: {recipe.lastUpdated} • Yield: {recipe.yieldCount}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-8 text-right">
                    <div className="hidden md:block">
                        <div className="text-xs text-gray-500 uppercase">Cost</div>
                        <div className="font-semibold text-slate-700">RM {costPerItem.toFixed(2)}</div>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-xs text-gray-500 uppercase">Price</div>
                        <div className="font-semibold text-slate-700">RM {recipe.salePrice.toFixed(2)}</div>
                    </div>
                    <div className="w-24">
                        <div className="text-xs text-gray-500 uppercase">Margin</div>
                        <div className={`font-bold ${margin < 65 ? 'text-red-500' : 'text-green-600'}`}>{margin.toFixed(1)}%</div>
                    </div>
                    <button 
                        onClick={(e) => startEdit(e, recipe)}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-500"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              {isExpanded && (
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">Cost Breakdown (Batch)</h4>
                    <table className="w-full text-sm mb-4">
                        <thead className="text-gray-500 border-b">
                            <tr>
                                <th className="text-left pb-2">Ingredient</th>
                                <th className="text-right pb-2">Qty</th>
                                <th className="text-right pb-2">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recipe.ingredients.map((ri, i) => {
                                const ing = ingredients.find(ing => ing.id === ri.ingredientId);
                                let cost = 0;
                                if(ing) {
                                     const totalQuantity = (ing.caseQty || 1) * ing.quantitySize;
                                     let costPerUnit = ing.cost / totalQuantity;
                                     if (ing.unit === Unit.KG && ri.unit === Unit.G) costPerUnit = costPerUnit / 1000;
                                     else if (ing.unit === Unit.L && ri.unit === Unit.ML) costPerUnit = costPerUnit / 1000;
                                     cost = costPerUnit * ri.quantity;
                                }
                                return (
                                    <tr key={i}>
                                        <td className="py-2">{ing?.name || 'Unknown'}</td>
                                        <td className="py-2 text-right">{ri.quantity} {ri.unit}</td>
                                        <td className="py-2 text-right text-gray-700">RM {cost.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            <tr className="bg-gray-100 font-semibold">
                                <td className="py-2 pl-2">Labor</td>
                                <td className="py-2"></td>
                                <td className="py-2 text-right">RM {recipe.laborCost.toFixed(2)}</td>
                            </tr>
                             <tr className="bg-slate-200 font-bold text-slate-800">
                                <td className="py-2 pl-2">Total Batch Cost</td>
                                <td className="py-2"></td>
                                <td className="py-2 text-right">RM {totalCost.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recipes;