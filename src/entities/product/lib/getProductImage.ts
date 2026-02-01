interface Module {
  default: string;
}

const images = import.meta.glob<Module>('../assets/*');

export async function getProductImage(filename: string) {
  try {
    const path = `../assets/${filename}`;
    const importer = images[path];
    if (!importer) throw new Error('Image not found: ' + filename);
    const { default: imageUrl } = await importer();
    return imageUrl;
  } catch (e) {
    console.error(e);
    return '';
  }
}
