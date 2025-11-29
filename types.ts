export enum Unit {
  // Weight
  MG = 'mg',
  G = 'g',
  OZ = 'oz',
  LB = 'lb',
  KG = 'Kg',
  T = 'T',
  
  // Volume
  PINCH = 'pinch',
  ML = 'ml',
  TSP = 'tsp',
  TBSP = 'tbsp',
  FLOZ = 'floz',
  DL = 'dL',
  CUP = 'cup',
  PT = 'pt',
  QT = 'qt',
  L = 'L',
  GAL = 'gal',
  KL = 'kL',

  // Quantity
  EACH = 'each',
  DOZEN = 'dozen',
  HUNDRED = 'hundred',
  THOUSAND = 'thousand',
  MILLION = 'million',

  // Time
  S = 's',
  MIN = 'min',
  HR = 'hr',
  DAY = 'day',

  // Length
  MM = 'mm',
  CM = 'cm',
  IN = 'in',
  FT = 'ft',
  YD = 'yd',
  M = 'm',
  KM = 'km',
  MI = 'mi'
}

export interface Conversion {
  fromUnit: Unit;
  toUnit: Unit;
  factor: number;
}

export interface Nutrition {
  calories: number;
  fat: number;
  saturatedFat: number;
  carbs: number;
  sugar: number;
  protein: number;
  fiber: number;
  sodium: number;
}

export interface Ingredient {
  id: string;
  name: string;
  cost: number;
  unit: Unit;
  supplier: string;
  quantitySize: number; // Pack Size (e.g. 5 for 5kg)
  caseQty: number;      // Number of packs in a case (default 1)
  uniqueCode?: string;
  orderCode?: string;
  brand?: string;
  category?: string;
  conversions?: Conversion[];
  nutrition?: Partial<Nutrition>;
  allergens?: string[];
  notes?: string;
  lastUpdated?: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number; // Amount used in recipe
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  yieldCount: number; // How many items this recipe makes
  salePrice: number;
  laborCost: number;
  lastUpdated: string;
}

export enum ViewState {
  DASHBOARD = 'dashboard',
  RECIPES = 'recipes',
  INGREDIENTS = 'ingredients',
  PLANNING = 'planning',
}