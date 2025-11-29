import React, { useState } from 'react';
import { Ingredient, Recipe, Unit, Conversion, Nutrition } from '../types';
import { Search, Plus, Trash2, Edit2, HelpCircle, ChevronDown, ChevronUp, Briefcase, X, Scale, AlertCircle, Download, Upload, MoreHorizontal, Video, Check, Info } from 'lucide-react';

interface IngredientsProps {
  ingredients: Ingredient[];
  recipes?: Recipe[];
  onAdd: (ing: Ingredient) => void;
  onUpdate: (ing: Ingredient) => void;
  onDelete: (id: string) => void;
}

const UnitOptions = () => (
  <>
    <optgroup label="Weight">
      <option value={Unit.MG}>mg</option>
      <option value={Unit.G}>g</option>
      <option value={Unit.OZ}>oz</option>
      <option value={Unit.LB}>lb</option>
      <option value={Unit.KG}>Kg</option>
      <option value={Unit.T}>T</option>
    </optgroup>
    <optgroup label="Volume">
      <option value={Unit.PINCH}>pinch</option>
      <option value={Unit.ML}>ml</option>
      <option value={Unit.TSP}>tsp</option>
      <option value={Unit.TBSP}>tbsp</option>
      <option value={Unit.FLOZ}>floz</option>
      <option value={Unit.DL}>dL</option>
      <option value={Unit.CUP}>cup</option>
      <option value={Unit.PT}>pt</option>
      <option value={Unit.QT}>qt</option>
      <option value={Unit.L}>L</option>
      <option value={Unit.GAL}>gal</option>
      <option value={Unit.KL}>kL</option>
    </optgroup>
    <optgroup label="Quantity">
      <option value={Unit.EACH}>each</option>
      <option value={Unit.DOZEN}>dozen</option>
      <option value={Unit.HUNDRED}>hundred</option>
      <option value={Unit.THOUSAND}>thousand</option>
      <option value={Unit.MILLION}>million</option>
    </optgroup>
    <optgroup label="Time">
      <option value={Unit.S}>s</option>
      <option value={Unit.MIN}>min</option>
      <option value={Unit.HR}>hr</option>
      <option value={Unit.DAY}>day</option>
    </optgroup>
    <optgroup label="Length">
      <option value={Unit.MM}>mm</option>
      <option value={Unit.CM}>cm</option>
      <option value={Unit.IN}>in</option>
      <option value={Unit.FT}>ft</option>
      <option value={Unit.YD}>yd</option>
      <option value={Unit.M}>m</option>
      <option value={Unit.KM}>km</option>
      <option value={Unit.MI}>mi</option>
    </optgroup>
  </>
);

const ALLERGEN_LIST = ['Wheat', 'Milk', 'Eggs', 'Soy', 'Peanuts', 'Tree Nuts', 'Fish', 'Shellfish', 'Sesame'];

type ViewMode = 'list' | 'form' | 'detail' | 'quick_update';
type Tab = 'details' | 'nutrition' | 'images' | 'history';

const Ingredients: React.FC<IngredientsProps> = ({ ingredients, recipes = [], onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  // Creation/Edit State
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '', cost: 0, unit: Unit.KG, quantitySize: 1, caseQty: 1, 
    supplier: '', orderCode: '', brand: '', category: 'Uncategorized', conversions: [],
    nutrition: {}, allergens: [], notes: ''
  });

  // UI State
  const [showPrimary, setShowPrimary] = useState(true);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showConverters, setShowConverters] = useState(false);
  const [showAllergens, setShowAllergens] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categoryOptions = ['Food', 'Labor', 'Packaging', 'Uncategorized'];

  const filtered = ingredients.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Handlers ---
  const handleCreateNew = () => {
    setNewIngredient({ 
      name: '', cost: 0, unit: Unit.KG, quantitySize: 1, caseQty: 1, 
      supplier: '', orderCode: '', brand: '', category: 'Uncategorized', conversions: [],
      nutrition: {}, allergens: [], notes: ''
    });
    setSelectedIngredient(null);
    setViewMode('form');
    // Reset sections
    setShowPrimary(true); setShowNutrition(false); setShowConverters(false); setShowAllergens(false);
    setShowSuccessBanner(false);
  };

  const handleEdit = (ing: Ingredient) => {
    setNewIngredient({ ...ing });
    setSelectedIngredient(ing);
    setViewMode('form');
    // Expand appropriate sections if data exists
    if (ing.conversions && ing.conversions.length > 0) setShowConverters(true);
    if (ing.nutrition && Object.keys(ing.nutrition).length > 0) setShowNutrition(true);
    if ((ing.allergens && ing.allergens.length > 0) || ing.notes) setShowAllergens(true);
  };

  const handleRowClick = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setViewMode('detail');
    setShowSuccessBanner(false);
    setActiveTab('details');
  };

  const generateUniqueCode = () => `ING-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.name && newIngredient.cost !== undefined) {
      const now = new Date().toISOString().split('T')[0];
      const ingredientData: Ingredient = {
        id: selectedIngredient?.id || Math.random().toString(36).substr(2, 9),
        uniqueCode: selectedIngredient?.uniqueCode || generateUniqueCode(),
        name: newIngredient.name,
        cost: Number(newIngredient.cost),
        unit: newIngredient.unit || Unit.KG,
        quantitySize: Number(newIngredient.quantitySize) || 1,
        caseQty: Number(newIngredient.caseQty) || 1,
        supplier: newIngredient.supplier || 'General',
        orderCode: newIngredient.orderCode,
        brand: newIngredient.brand,
        category: newIngredient.category,
        conversions: newIngredient.conversions || [],
        nutrition: newIngredient.nutrition,
        allergens: newIngredient.allergens,
        notes: newIngredient.notes,
        lastUpdated: now
      };

      if (selectedIngredient) {
        onUpdate(ingredientData);
        setSelectedIngredient(ingredientData);
        setViewMode('detail'); // Go back to detail view
      } else {
        onAdd(ingredientData);
        setSelectedIngredient(ingredientData);
        setShowSuccessBanner(true);
        setViewMode('detail'); // Go to detail view
      }
    }
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this ingredient?')) {
        onDelete(id);
        setViewMode('list');
        setSelectedIngredient(null);
    }
  };

  const getCostPerBaseUnit = (ing: Ingredient) => {
    const totalQty = (ing.caseQty || 1) * ing.quantitySize;
    if (totalQty === 0) return '0.00';
    return (ing.cost / totalQty).toFixed(2);
  };

  const getPricePerUnitString = (ing: Ingredient) => {
      return `RM${getCostPerBaseUnit(ing)}/${ing.unit}`;
  };

  const handleQuickUpdate = (id: string, field: keyof Ingredient, value: any) => {
    const ing = ingredients.find(i => i.id === id);
    if (ing) onUpdate({ ...ing, [field]: value });
  };

  // Common Input Style
  const inputStyle = "w-full border border-slate-300 bg-slate-50 p-2.5 rounded focus:ring-1 focus:ring-brand focus:bg-white outline-none text-slate-700 placeholder-slate-400 shadow-sm transition-colors";

  // --- Helpers ---
  const addConversion = () => {
    const current = newIngredient.conversions || [];
    setNewIngredient({ ...newIngredient, conversions: [...current, { fromUnit: Unit.CUP, toUnit: Unit.G, factor: 120 }] });
  };
  const removeConversion = (index: number) => {
    const current = newIngredient.conversions || [];
    const updated = [...current]; updated.splice(index, 1);
    setNewIngredient({ ...newIngredient, conversions: updated });
  };
  const updateConversion = (index: number, field: keyof Conversion, value: any) => {
    const current = newIngredient.conversions || [];
    const updated = [...current]; updated[index] = { ...updated[index], [field]: value };
    setNewIngredient({ ...newIngredient, conversions: updated });
  };
  const toggleAllergen = (allergen: string) => {
    const current = newIngredient.allergens || [];
    if (current.includes(allergen)) setNewIngredient({ ...newIngredient, allergens: current.filter(a => a !== allergen) });
    else setNewIngredient({ ...newIngredient, allergens: [...current, allergen] });
  };

  const renderHelpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
           <h3 className="text-2xl font-bold text-slate-800">Case / Pack / Unit Help</h3>
           <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="border rounded-md p-4">
            <h4 className="font-bold text-lg mb-4 text-slate-800">For purchasing individual ingredients</h4>
            <div className="flex items-center gap-4 mb-2">
               <div className="w-16 h-20 bg-orange-100 border border-orange-200 flex items-center justify-center rounded">
                  <span className="text-xs text-orange-800 font-bold">FLOUR 5lb</span>
               </div>
               <div className="flex-1">
                 <div className="text-sm font-semibold text-gray-700 mb-1">Case Qty / Pack Size & Unit</div>
                 <div className="flex items-center gap-2">
                    <div className="border-2 border-orange-400 p-2 rounded w-16 text-center font-bold">1</div>
                    <span className="text-gray-400">/</span>
                    <div className="border-2 border-orange-400 p-2 rounded w-16 text-center font-bold">5</div>
                    <div className="border-2 border-orange-400 p-2 rounded flex-1 text-center font-bold">Pound (lb)</div>
                 </div>
               </div>
            </div>
            <p className="text-gray-700 italic">This means <strong className="text-black">I buy 1 × 5lb bag of flour</strong>. Enter the price for the single bag.</p>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button onClick={() => setShowHelpModal(false)} className="bg-brand text-white px-6 py-2 rounded font-medium">Close</button>
        </div>
      </div>
    </div>
  );

  // ---------------- VIEW: DETAIL ----------------
  if (viewMode === 'detail' && selectedIngredient) {
      const ing = selectedIngredient;
      const recipesUsing = recipes.filter(r => r.ingredients.some(ri => ri.ingredientId === ing.id));

      return (
          <div className="max-w-6xl mx-auto pb-12 space-y-6">
              {/* Breadcrumb & Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                      <div className="text-sm breadcrumbs text-gray-500 mb-1">
                          <span className="cursor-pointer hover:text-brand" onClick={() => setViewMode('list')}>Ingredients</span> » <span className="text-gray-900 font-medium">{ing.name}</span>
                      </div>
                      <h1 className="text-2xl font-bold text-slate-800">{ing.name}</h1>
                  </div>
                  <div className="flex items-center gap-2">
                      <button onClick={handleCreateNew} className="bg-white border border-brand text-brand px-3 py-1.5 rounded flex items-center text-sm font-medium hover:bg-sky-50"><Plus className="w-4 h-4 mr-1" /> New</button>
                      <button onClick={() => handleEdit(ing)} className="bg-white border border-brand text-brand px-3 py-1.5 rounded flex items-center text-sm font-medium hover:bg-sky-50"><Edit2 className="w-4 h-4 mr-1" /> Edit</button>
                      <button className="bg-white border border-brand text-brand px-3 py-1.5 rounded flex items-center text-sm font-medium hover:bg-sky-50"><Upload className="w-4 h-4 mr-1" /> Replace</button>
                      <button className="bg-white border border-brand text-brand px-3 py-1.5 rounded flex items-center text-sm font-medium hover:bg-sky-50"><MoreHorizontal className="w-4 h-4 mr-1" /> Create Copy</button>
                      <button onClick={() => handleDelete(ing.id)} className="bg-white border border-red-200 text-red-500 px-3 py-1.5 rounded flex items-center text-sm font-medium hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      <a href="https://vimeo.com/1013613450" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded flex items-center text-sm font-medium hover:bg-gray-50">
                         <Video className="w-4 h-4 mr-1 text-blue-500" /> Ingredient Overview (2:06)
                      </a>
                  </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 flex space-x-6">
                  {(['details', 'nutrition', 'images', 'history'] as Tab[]).map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                          {tab === 'nutrition' ? 'Nutrition Details' : tab === 'history' ? 'Cost History' : tab}
                      </button>
                  ))}
              </div>

              {/* Tab Content: Details */}
              {activeTab === 'details' && (
                  <div className="space-y-6">
                      {/* Ingredient Suppliers and Pricing */}
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                              <h3 className="font-bold text-slate-800">Ingredient Suppliers and Pricing</h3>
                          </div>
                          
                          {showSuccessBanner && (
                              <div className="bg-sky-100 border-l-4 border-sky-500 text-sky-800 p-4 flex items-center justify-between">
                                  <div className="flex items-center">
                                     <Info className="w-5 h-5 mr-2" />
                                     <span className="font-medium">New ingredient created successfully</span>
                                  </div>
                                  <button onClick={() => setShowSuccessBanner(false)} className="text-sky-600 hover:text-sky-800"><X className="w-4 h-4" /></button>
                              </div>
                          )}

                          <div className="overflow-x-auto">
                              <table className="w-full text-sm text-left">
                                  <thead className="text-xs font-bold text-slate-500 uppercase bg-white border-b border-gray-100">
                                      <tr>
                                          <th className="px-6 py-3">Supplier</th>
                                          <th className="px-6 py-3">Order Code</th>
                                          <th className="px-6 py-3">Brand</th>
                                          <th className="px-6 py-3">Purchase amount</th>
                                          <th className="px-6 py-3">Price</th>
                                          <th className="px-6 py-3">Price/unit</th>
                                          <th className="px-6 py-3">Last % change</th>
                                          <th className="px-6 py-3">Last price update</th>
                                          <th className="px-6 py-3">Lead Time</th>
                                          <th className="px-6 py-3">Preferred?</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                      <tr className="hover:bg-gray-50">
                                          <td className="px-6 py-4 text-brand font-medium cursor-pointer" onClick={() => handleEdit(ing)}>{ing.supplier}</td>
                                          <td className="px-6 py-4">{ing.orderCode || '-'}</td>
                                          <td className="px-6 py-4">{ing.brand || '-'}</td>
                                          <td className="px-6 py-4">{ing.quantitySize} {ing.unit}</td>
                                          <td className="px-6 py-4">RM{ing.cost.toFixed(2)}</td>
                                          <td className="px-6 py-4">{getPricePerUnitString(ing)}</td>
                                          <td className="px-6 py-4 text-blue-500">-</td>
                                          <td className="px-6 py-4">{ing.lastUpdated || 'Never'}</td>
                                          <td className="px-6 py-4">-</td>
                                          <td className="px-6 py-4"><Check className="w-4 h-4 text-slate-800" /></td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                          <div className="p-4 border-t border-gray-100 bg-gray-50">
                              <button onClick={() => handleEdit(ing)} className="bg-brand text-white px-4 py-2 rounded text-sm font-medium hover:bg-sky-700 flex items-center w-fit shadow-sm">
                                  <Plus className="w-4 h-4 mr-2" /> Add Supplier
                              </button>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Ingredient Details */}
                          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                  <h3 className="font-bold text-slate-800">Ingredient Details</h3>
                              </div>
                              <div className="p-6 space-y-3 text-sm">
                                  <div className="grid grid-cols-3 gap-4">
                                      <span className="font-bold text-slate-700">Category:</span>
                                      <span className="col-span-2 text-slate-600">{ing.category}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                      <span className="font-bold text-slate-700">Is Added Sugar:</span>
                                      <span className="col-span-2 text-slate-600">Unspecified</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                      <span className="font-bold text-slate-700">Created:</span>
                                      <span className="col-span-2 text-slate-600">{ing.lastUpdated || new Date().toISOString().split('T')[0]}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                      <span className="font-bold text-slate-700">Last Updated:</span>
                                      <span className="col-span-2 text-slate-600">{ing.lastUpdated || 'Never'}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                      <span className="font-bold text-slate-700">Unique Code:</span>
                                      <span className="col-span-2 text-slate-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{ing.uniqueCode}</span>
                                  </div>
                              </div>
                          </div>

                          {/* Nutrition Data Summary */}
                          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                  <h3 className="font-bold text-slate-800">Nutrition Data</h3>
                              </div>
                              <div className="p-6 text-sm text-slate-600 italic">
                                  {ing.nutrition && Object.keys(ing.nutrition).length > 0 
                                      ? 'Nutrition data available. See "Nutrition Details" tab.' 
                                      : 'This ingredient has no nutrition information associated.'}
                              </div>
                          </div>
                      </div>

                      {/* Allergens */}
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                  <h3 className="font-bold text-slate-800">Allergens</h3>
                           </div>
                           <div className="p-6 text-sm text-slate-600 italic">
                               {ing.allergens && ing.allergens.length > 0 
                                  ? `Contains: ${ing.allergens.join(', ')}`
                                  : 'Allergen information unspecified'}
                           </div>
                      </div>

                      {/* Recipes Using This Ingredient */}
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                  <h3 className="font-bold text-slate-800">Recipes Using This Ingredient</h3>
                           </div>
                           <div className="p-6 text-sm text-slate-600 italic">
                               {recipesUsing.length > 0 
                                 ? (
                                   <ul className="list-disc list-inside space-y-1 not-italic text-brand">
                                     {recipesUsing.map(r => <li key={r.id} className="cursor-pointer hover:underline">{r.name}</li>)}
                                   </ul>
                                 ) 
                                 : 'This ingredient is not currently used in any recipes.'}
                           </div>
                      </div>
                  </div>
              )}

              {/* Placeholder content for other tabs */}
              {activeTab !== 'details' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500">
                      Content for {activeTab} will appear here.
                  </div>
              )}
          </div>
      );
  }

  // ---------------- VIEW: CREATE / EDIT FORM ----------------
  if (viewMode === 'form') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
         <div className="text-sm breadcrumbs text-gray-500 mb-2">
           <span className="cursor-pointer hover:text-brand" onClick={() => { setSelectedIngredient(null); setViewMode('list'); }}>Ingredients</span> » <span className="text-gray-900 font-medium">{selectedIngredient ? 'Edit Ingredient' : 'New Ingredient'}</span>
         </div>
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">{selectedIngredient ? 'Edit Ingredient' : 'New Ingredient'}</h1>
         </div>
         <form onSubmit={handleSubmit} className="space-y-4">
             {/* Primary Fields */}
             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-sky-50 p-3 flex items-center cursor-pointer border-b border-gray-200" onClick={() => setShowPrimary(!showPrimary)}>
                   <Briefcase className="w-4 h-4 text-brand mr-2" />
                   <span className="font-semibold text-brand text-sm">Primary Ingredient Fields</span>
                   <div className="flex-1"></div>
                   <span className="text-brand text-sm flex items-center">{showPrimary ? <><ChevronUp className="w-4 h-4 mr-1" /> Collapse</> : <><ChevronDown className="w-4 h-4 mr-1" /> Expand</>}</span>
                </div>
                {showPrimary && (
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                     <div><label className="block text-sm font-semibold text-slate-600 mb-1.5">Name *</label><input required className={inputStyle} placeholder="Ingredient name?" value={newIngredient.name} onChange={e => setNewIngredient({...newIngredient, name: e.target.value})} /></div>
                     <div><label className="block text-sm font-semibold text-slate-600 mb-1.5 flex items-center">Supplier <HelpCircle className="w-4 h-4 ml-1 text-brand cursor-help" /></label><select className={inputStyle} value={newIngredient.supplier} onChange={e => setNewIngredient({...newIngredient, supplier: e.target.value})}><option value="">Choose a supplier</option><option value="GrainCo">GrainCo</option><option value="DairyFarm">DairyFarm</option><option value="SweetSupply">SweetSupply</option><option value="General">General Store</option></select></div>
                     <div><label className="block text-sm font-semibold text-slate-600 mb-1.5">Price *</label><input type="number" step="0.01" required className={inputStyle} placeholder="Price" value={newIngredient.cost || ''} onChange={e => setNewIngredient({...newIngredient, cost: parseFloat(e.target.value)})} /></div>
                     <div><label className="block text-sm font-semibold text-slate-600 mb-1.5">Order Code</label><input className={inputStyle} placeholder="Supplier order code" value={newIngredient.orderCode} onChange={e => setNewIngredient({...newIngredient, orderCode: e.target.value})} /></div>
                     <div className="md:col-span-2"><label className="block text-sm font-semibold text-slate-600 mb-1.5 flex items-center">Case Qty / Pack Size & Unit <button type="button" onClick={() => setShowHelpModal(true)} className="ml-2 text-brand hover:underline text-xs flex items-center">(Quick Help <HelpCircle className="w-3 h-3 ml-0.5" />)</button></label><div className="flex items-center gap-3"><input type="number" className="w-28 border border-slate-300 bg-slate-50 p-2.5 rounded focus:ring-1 focus:ring-brand focus:bg-white outline-none text-slate-700 shadow-sm" placeholder="Case Qty" value={newIngredient.caseQty} onChange={e => setNewIngredient({...newIngredient, caseQty: parseFloat(e.target.value)})} /><span className="text-slate-400 font-bold">/</span><input type="number" step="0.1" className="flex-1 border border-slate-300 bg-slate-50 p-2.5 rounded focus:ring-1 focus:ring-brand focus:bg-white outline-none text-slate-700 shadow-sm min-w-0" placeholder="Pack Size" value={newIngredient.quantitySize} onChange={e => setNewIngredient({...newIngredient, quantitySize: parseFloat(e.target.value)})} /><select className="w-40 border border-slate-300 bg-slate-50 p-2.5 rounded focus:ring-1 focus:ring-brand focus:bg-white outline-none text-slate-700 shadow-sm" value={newIngredient.unit} onChange={e => setNewIngredient({...newIngredient, unit: e.target.value as Unit})}><UnitOptions /></select></div><p className="text-xs text-slate-500 mt-1.5 ml-1">I buy {newIngredient.caseQty || 1} x {newIngredient.quantitySize || 0}{newIngredient.unit} @ RM {newIngredient.cost || 0}</p></div>
                     <div><label className="block text-sm font-semibold text-slate-600 mb-1.5">Brand</label><input className={inputStyle} value={newIngredient.brand} onChange={e => setNewIngredient({...newIngredient, brand: e.target.value})} /></div>
                     <div className="relative"><label className="block text-sm font-semibold text-slate-600 mb-1.5">Category</label><div className="w-full border border-slate-300 bg-slate-50 p-2.5 rounded focus-within:ring-1 focus-within:ring-brand focus-within:bg-white cursor-text flex flex-wrap gap-2 min-h-[44px] shadow-sm transition-colors" onClick={() => setIsCategoryOpen(true)}>{newIngredient.category && newIngredient.category !== '' && (<span className="bg-sky-100 text-sky-800 text-sm px-2 py-0.5 rounded flex items-center group border border-sky-200">{newIngredient.category}<button type="button" onClick={(e) => { e.stopPropagation(); setNewIngredient({...newIngredient, category: ''}); }} className="ml-2 text-sky-500 hover:text-sky-700 focus:outline-none"><X className="w-3 h-3" /></button></span>)}<input className="flex-1 outline-none text-slate-700 text-sm min-w-[50px] bg-transparent" onFocus={() => setIsCategoryOpen(true)} readOnly /><ChevronDown className="w-4 h-4 text-slate-400 self-center" /></div>{isCategoryOpen && (<><div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)}></div><div className="absolute z-20 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-48 overflow-auto">{categoryOptions.map(opt => (<div key={opt} className="px-4 py-2 hover:bg-sky-50 text-sm cursor-pointer text-gray-700" onClick={() => { setNewIngredient({...newIngredient, category: opt}); setIsCategoryOpen(false); }}>{opt}</div>))}</div></>)}</div>
                     <div><label className="block text-sm font-semibold text-slate-600 mb-1.5">Country of Origin</label><input className={inputStyle} /></div>
                  </div>
                )}
             </div>

             {/* Nutrition Data */}
             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                 <div className="p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowNutrition(!showNutrition)}>
                   <span className="text-brand mr-2">🍎</span><span className="font-semibold text-brand text-sm">Nutrition Data</span><div className="flex-1"></div><span className="text-brand text-sm flex items-center">{showNutrition ? <><ChevronUp className="w-4 h-4 mr-1" /> Collapse</> : <><ChevronDown className="w-4 h-4 mr-1" /> Expand</>}</span>
                </div>
                {showNutrition && (
                  <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                     <div><label className="block text-xs font-semibold text-slate-500 mb-1">Calories (kcal)</label><input type="number" className={inputStyle} value={newIngredient.nutrition?.calories || ''} onChange={e => setNewIngredient({...newIngredient, nutrition: {...newIngredient.nutrition, calories: parseFloat(e.target.value)}})} /></div>
                     <div><label className="block text-xs font-semibold text-slate-500 mb-1">Fat (g)</label><input type="number" className={inputStyle} value={newIngredient.nutrition?.fat || ''} onChange={e => setNewIngredient({...newIngredient, nutrition: {...newIngredient.nutrition, fat: parseFloat(e.target.value)}})} /></div>
                     <div><label className="block text-xs font-semibold text-slate-500 mb-1">Carbs (g)</label><input type="number" className={inputStyle} value={newIngredient.nutrition?.carbs || ''} onChange={e => setNewIngredient({...newIngredient, nutrition: {...newIngredient.nutrition, carbs: parseFloat(e.target.value)}})} /></div>
                     <div><label className="block text-xs font-semibold text-slate-500 mb-1">Protein (g)</label><input type="number" className={inputStyle} value={newIngredient.nutrition?.protein || ''} onChange={e => setNewIngredient({...newIngredient, nutrition: {...newIngredient.nutrition, protein: parseFloat(e.target.value)}})} /></div>
                     <div className="col-span-full text-xs text-gray-500 italic">Enter values per 100g/ml</div>
                  </div>
                )}
             </div>

             {/* Converters */}
             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                 <div className="p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowConverters(!showConverters)}>
                   <Scale className="w-4 h-4 text-brand mr-2" /><span className="font-semibold text-brand text-sm">Measurement Converters</span><div className="flex-1"></div><span className="text-brand text-sm flex items-center">{showConverters ? <><ChevronUp className="w-4 h-4 mr-1" /> Collapse</> : <><ChevronDown className="w-4 h-4 mr-1" /> Expand</>}</span>
                </div>
                 {showConverters && (
                   <div className="p-6 space-y-3">
                      {(newIngredient.conversions || []).map((conv, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="font-bold text-slate-500 w-6 text-center">1</span>
                          <select className="flex-1 border border-slate-300 bg-white p-2 rounded text-sm" value={conv.fromUnit} onChange={(e) => updateConversion(idx, 'fromUnit', e.target.value)}><UnitOptions /></select>
                          <span className="font-bold text-slate-400">=</span>
                          <input type="number" step="0.01" className="w-24 border border-slate-300 bg-white p-2 rounded text-sm" value={conv.factor} onChange={(e) => updateConversion(idx, 'factor', parseFloat(e.target.value))} />
                          <select className="flex-1 border border-slate-300 bg-white p-2 rounded text-sm" value={conv.toUnit} onChange={(e) => updateConversion(idx, 'toUnit', e.target.value)}><UnitOptions /></select>
                          <button type="button" onClick={() => removeConversion(idx)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={addConversion} className="text-sm text-brand font-medium flex items-center hover:underline mt-2"><Plus className="w-4 h-4 mr-1" /> Add Conversion</button>
                   </div>
                 )}
             </div>

             {/* Allergens, Notes */}
             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                 <div className="p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowAllergens(!showAllergens)}>
                   <AlertCircle className="w-4 h-4 text-brand mr-2" /><span className="font-semibold text-brand text-sm">Allergens, Ingredient List, Notes, etc.</span><div className="flex-1"></div><span className="text-brand text-sm flex items-center">{showAllergens ? <><ChevronUp className="w-4 h-4 mr-1" /> Collapse</> : <><ChevronDown className="w-4 h-4 mr-1" /> Expand</>}</span>
                </div>
                {showAllergens && (
                  <div className="p-6 space-y-6">
                    <div>
                       <label className="block text-sm font-semibold text-slate-600 mb-2">Contains Allergens:</label>
                       <div className="flex flex-wrap gap-3">
                         {ALLERGEN_LIST.map(allergen => (
                           <label key={allergen} className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded cursor-pointer hover:bg-slate-100">
                              <input type="checkbox" className="rounded text-brand focus:ring-brand" checked={(newIngredient.allergens || []).includes(allergen)} onChange={() => toggleAllergen(allergen)} />
                              <span className="text-sm text-slate-700">{allergen}</span>
                           </label>
                         ))}
                       </div>
                    </div>
                    <div><label className="block text-sm font-semibold text-slate-600 mb-1.5">Internal Notes</label><textarea className={inputStyle} rows={3} placeholder="Any special handling instructions?" value={newIngredient.notes || ''} onChange={e => setNewIngredient({...newIngredient, notes: e.target.value})} /></div>
                  </div>
                )}
             </div>

             <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={() => { setViewMode('list'); setSelectedIngredient(null); }} className="px-5 py-2.5 rounded text-slate-600 hover:bg-slate-100 font-medium">Cancel</button>
                <button type="submit" className="bg-brand hover:bg-sky-700 text-white px-6 py-2.5 rounded shadow font-medium transition-colors">{selectedIngredient ? 'Update Ingredient' : 'Save Ingredient'}</button>
             </div>
         </form>
         {showHelpModal && renderHelpModal()}
      </div>
    );
  }

  // ---------------- VIEW: LIST ----------------
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Ingredients</h1>
           <p className="text-gray-500 text-sm mt-1">Manage your raw materials and supplier costs.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-brand hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </button>
      </div>

      {/* Secondary Nav */}
      <div className="flex flex-wrap border-b border-gray-200">
         <button className={`mr-6 py-2 text-sm font-medium ${viewMode === 'list' ? 'text-brand border-b-2 border-brand' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setViewMode('list')}>All</button>
         <button className={`mr-6 py-2 text-sm font-medium ${viewMode === 'quick_update' ? 'text-brand border-b-2 border-brand' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setViewMode('quick_update')}>Quick Update Prices</button>
         <button className="mr-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"><Download className="w-4 h-4 mr-1" /> Download</button>
         <button className="mr-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"><Upload className="w-4 h-4 mr-1" /> Upload</button>
         <button className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"><MoreHorizontal className="w-4 h-4 mr-1" /> Quick Reports</button>
      </div>

      {/* Filters/Search (Only in All mode) */}
      {viewMode === 'list' && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex gap-4 shadow-sm">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
                type="text" 
                placeholder="Search ingredients..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-300 bg-slate-50 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-slate-700 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
        </div>
      )}

      {/* Table Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {viewMode === 'list' ? (
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                    <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Purchase Cost</th>
                    <th className="px-6 py-4">Cost / Unit</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.map(ing => (
                    <tr key={ing.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                           <span 
                              onClick={() => handleRowClick(ing)}
                              className="font-medium text-brand hover:underline cursor-pointer"
                           >
                              {ing.name}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">{ing.supplier}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                        RM {ing.cost.toFixed(2)} / {(ing.caseQty || 1) * ing.quantitySize} {ing.unit}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                        RM {getCostPerBaseUnit(ing)} / {ing.unit}
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleEdit(ing)} className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(ing.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3">Ingredient</th>
                            <th className="px-4 py-3 w-32">Supplier</th>
                            <th className="px-4 py-3 w-32">Cost (RM)</th>
                            <th className="px-4 py-3 w-24">Case Qty</th>
                            <th className="px-4 py-3 w-24">Pack Size</th>
                            <th className="px-4 py-3 w-24">Unit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {ingredients.map(ing => (
                            <tr key={ing.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium">{ing.name}</td>
                                <td className="px-4 py-2 text-gray-500">{ing.supplier}</td>
                                <td className="px-4 py-2">
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="w-full border border-gray-300 rounded p-1.5 text-right focus:ring-1 focus:ring-brand outline-none"
                                        value={ing.cost}
                                        onChange={(e) => handleQuickUpdate(ing.id, 'cost', parseFloat(e.target.value))}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                     <input 
                                        type="number" 
                                        className="w-full border border-gray-300 rounded p-1.5 text-center focus:ring-1 focus:ring-brand outline-none"
                                        value={ing.caseQty}
                                        onChange={(e) => handleQuickUpdate(ing.id, 'caseQty', parseFloat(e.target.value))}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                     <input 
                                        type="number" 
                                        step="0.1"
                                        className="w-full border border-gray-300 rounded p-1.5 text-center focus:ring-1 focus:ring-brand outline-none"
                                        value={ing.quantitySize}
                                        onChange={(e) => handleQuickUpdate(ing.id, 'quantitySize', parseFloat(e.target.value))}
                                    />
                                </td>
                                <td className="px-4 py-2 text-gray-500">{ing.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default Ingredients;