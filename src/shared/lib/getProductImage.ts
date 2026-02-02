interface Module {
  default: string;
}

const images = import.meta.glob<Module>('/src/entities/product/assets/*');

export async function getProductImage(
  filename: string
): Promise<string | null> {
  try {
    const path = `/src/entities/product/assets/${filename}`;
    const importer = images[path];
    if (!importer) throw new Error('Image not found: ' + filename);
    const { default: imageUrl } = await importer();
    return imageUrl;
  } catch (e) {
    console.error(e);
    return null;
  }
}
