import { Ingredient, Recipe, Unit } from "./types";

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: '1', uniqueCode: 'ING-1001', name: 'Bread Flour', cost: 25.00, unit: Unit.KG, quantitySize: 20, caseQty: 1, supplier: 'GrainCo', category: 'Food', lastUpdated: '2025-11-29' },
  { id: '2', uniqueCode: 'ING-1002', name: 'Unsalted Butter', cost: 8.50, unit: Unit.KG, quantitySize: 1, caseQty: 1, supplier: 'DairyFarm', category: 'Food', lastUpdated: '2025-11-28' },
  { id: '3', uniqueCode: 'ING-1003', name: 'Sugar', cost: 18.00, unit: Unit.KG, quantitySize: 25, caseQty: 1, supplier: 'SweetSupply', category: 'Food', lastUpdated: '2025-11-20' },
  { id: '4', uniqueCode: 'ING-1004', name: 'Whole Milk', cost: 1.20, unit: Unit.L, quantitySize: 1, caseQty: 1, supplier: 'DairyFarm', category: 'Food', lastUpdated: '2025-11-25' },
  { id: '5', uniqueCode: 'ING-1005', name: 'Yeast (Instant)', cost: 15.00, unit: Unit.G, quantitySize: 500, caseQty: 1, supplier: 'BakeTech', category: 'Food', lastUpdated: '2025-10-15' },
  { id: '6', uniqueCode: 'ING-1006', name: 'Salt', cost: 5.00, unit: Unit.KG, quantitySize: 10, caseQty: 1, supplier: 'General', category: 'Food', lastUpdated: '2025-09-01' },
  { id: '7', uniqueCode: 'ING-1007', name: 'Eggs (Large)', cost: 10.50, unit: Unit.EACH, quantitySize: 30, caseQty: 1, supplier: 'LocalFarm', category: 'Food', lastUpdated: '2025-11-29' },
  { id: '8', uniqueCode: 'ING-1008', name: 'Dark Chocolate 70%', cost: 70.00, unit: Unit.KG, quantitySize: 5, caseQty: 1, supplier: 'ChocoWorld', category: 'Food', lastUpdated: '2025-11-10' },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Classic Croissant',
    yieldCount: 12,
    salePrice: 3.50,
    laborCost: 10.00,
    lastUpdated: '2023-10-25',
    ingredients: [
      { ingredientId: '1', quantity: 500, unit: Unit.G },
      { ingredientId: '2', quantity: 250, unit: Unit.G }, // Laminating butter
      { ingredientId: '3', quantity: 60, unit: Unit.G },
      { ingredientId: '4', quantity: 140, unit: Unit.ML },
      { ingredientId: '5', quantity: 10, unit: Unit.G },
      { ingredientId: '6', quantity: 10, unit: Unit.G },
    ]
  },
  {
    id: 'r2',
    name: 'Pain au Chocolat',
    yieldCount: 12,
    salePrice: 3.75,
    laborCost: 10.00,
    lastUpdated: '2023-10-26',
    ingredients: [
      { ingredientId: '1', quantity: 500, unit: Unit.G },
      { ingredientId: '2', quantity: 250, unit: Unit.G },
      { ingredientId: '8', quantity: 120, unit: Unit.G }, // Chocolate batons
      { ingredientId: '4', quantity: 140, unit: Unit.ML },
    ]
  }
];