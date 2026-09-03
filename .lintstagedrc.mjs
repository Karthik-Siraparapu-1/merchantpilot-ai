export default {
  '*.{js,mjs,cjs,ts,tsx,json,yml,yaml,md}': ['prettier --write'],
  '*.{ts,tsx}': ['eslint --max-warnings=0']
};
