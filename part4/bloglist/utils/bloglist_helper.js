const preparePayload = blog => {
  if (typeof blog.likes === 'undefined') {
    blog.likes = 0;
  }

  return blog;
};

module.exports = {
  preparePayload,
};
