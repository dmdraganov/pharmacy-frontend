// Согласно docs/data.md, subcategories находятся внутри Category.

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}
