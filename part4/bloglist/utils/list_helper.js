const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  } else {
    return blogs.reduce((sum, arr) => {
      return arr.likes + sum;
    }, 0);
  }
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    return blogs.reduce((prev, current) => {
      return (prev.likes > current.likes) ? prev : current;
    }, {});
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};