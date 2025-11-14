function MockItemCat(data) {
  return {
    ...data,
    save: async () => {
      if (data.name === 'fail') {
        throw new Error('Item name is required');  
      }
      return { ...data, _id: 'mockItem123' };
    },
  };
}
MockItemCat.findByIdAndUpdate = async (id, update) => {
  if (id === 'missing') return null;
  return {
    _id: id,
    name: update.name || 'default',
    image: update.image || 'default.png',
    categoryId: update.categoryId || 'cat123',
    projectId: update.projectId || 'proj123',
    lastUpdated: update.lastUpdated,
  };
};

MockItemCat.findByIdAndDelete = async (id) => {
  if (id === 'missing') return null;
  return { _id: id, name: 'deleted' };
};

export default MockItemCat;