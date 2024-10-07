export const getHours = (courseName) => {
  const pattern = new RegExp(/\d{4}/);
  
  let creditHours = 3;

  if (pattern.test(courseName)) {
      let coursePrefix = courseName.match(pattern);
      creditHours = parseInt(coursePrefix[0][1]);
  }

  return creditHours;
}
