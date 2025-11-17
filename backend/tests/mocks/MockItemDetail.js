function MockItemDetail(data) {
  return {
    ...data,
    save: async () => {
      if (!data.itemId) {
        throw new Error('itemId is required');
      }
      return { ...data, _id: 'mockDetail123' };
    },
  };
}

MockItemDetail.find = async (query) => {
  if (query.projectId === 'projEmpty') return []; 
  if (query.projectId === 'projTwo') return [{}, {}]; 
  return [{}]; 
};

MockItemDetail.findOne = async (query) => {
  if (query.itemId === 'missing') return null;
  return { _id: 'mockDetail123', itemId: query.itemId, lotNumber: 'LOT-1' };
};

MockItemDetail.findOneAndUpdate = async (filter, update) => {
  if (filter.itemId === 'error') throw new Error('Update failed');
  return {
    _id: 'mockDetail123',
    itemId: filter.itemId,
    lotNumber: update.lotNumber,
    projectId: update.projectId,
    lastUpdated: update.lastUpdated,
  };
};

export default MockItemDetail;
