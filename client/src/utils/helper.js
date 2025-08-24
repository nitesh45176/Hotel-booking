export const getInitials = (name) => {
  if (!name) return "";

  return name.trim()[0].toUpperCase(); // only first letter, capitalized
};
