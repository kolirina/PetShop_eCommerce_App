const descriptions = [
  'product-desc',
  'cat-food-description',
  'po-desc',
  'dog-food-description',
];
type Description = (typeof descriptions)[number];
const isDescription = (name: string): name is Description =>
  descriptions.includes(name);

const specifications = [
  'cat-food-specification',
  'pr-spec',
  'dog-food-specification',
  'product-specification',
];
type Specification = (typeof specifications)[number];
const isSpecification = (name: string): name is Specification =>
  specifications.includes(name);

export { isDescription, isSpecification };
