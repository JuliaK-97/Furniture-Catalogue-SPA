function MockCatalogue(data) {
  return {
    ...data,
    save: async () => {
      if (!data.name) {
        throw new Error('Catalogue name is required');
      }
      return { ...data, _id: 'mockCat123' };
    },
  };
}
MockCatalogue.find = async (query) => {
  if (query.projectId === 'projEmpty') return [];
  return [
    { _id: 'item1', name: 'desk', categoryId: { categoryName: 'Tables' } },
    { _id: 'item2', name: 'chair', categoryId: { categoryName: 'Chairs' } },
  ];
};

MockCatalogue.findDetails = async (ids) => {
  return [
    { itemId: 'item1', lotNumber: 'LOT-1', condition: 'Good', location: { room: 'A' } },
    { itemId: 'item2', lotNumber: 'LOT-2', condition: 'Fair', location: { room: 'B' } },
  ];
};

MockCatalogue.findByIdAndDelete = async (id) => {
  if (id === 'missing') return null;
  return { _id: id, name: 'deleted item' };
};
MockCatalogue.findOneAndDelete = async (query) => {
  if (query.itemId === 'missing') return null;
  return { _id: 'detail123', itemId: query.itemId };
};


export default MockCatalogue;
