function MockCategory(data) {
  return {
    ...data,
    save: async () => {
      if (data.categoryName === 'duplicate') {
        const error = new Error('Duplicate key');
        error.code = 11000;
        throw error;
      }
      return { ...data, _id: 'mockCat123' };
    },
  };
}

MockCategory.findByIdAndUpdate = async (id, update, options) => {
  if (id === 'missing') return null;
  return {
    _id: id,
    categoryName: update.categoryName || 'default',
    lastUpdated: update.lastUpdated,
  };
};

MockCategory.findByIdAndDelete = async (id) => {
  if (id === 'missing') return null;
  return { _id: id, categoryName: 'deleted' };
};

export default MockCategory;

