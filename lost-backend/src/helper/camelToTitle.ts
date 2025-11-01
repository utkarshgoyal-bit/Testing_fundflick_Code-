export default function camelToTitle(camelCaseStr: string) {
  // Insert spaces before uppercase letters using a regular expression
  const spacedStr = camelCaseStr.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Capitalize the first letter of each word
  return spacedStr.replace(/\b\w/g, char => char.toUpperCase());
}
