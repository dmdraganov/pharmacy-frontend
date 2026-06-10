// Согласно docs/data.md, categories находятся внутри Section.

export interface Category {
  id: string;
  name: string;
  sectionId: string;
}

export interface Section {
  id: string;
  name: string;
  categories: Category[];
}
