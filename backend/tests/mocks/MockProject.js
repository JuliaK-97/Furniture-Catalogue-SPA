function MockProject(data) {
  return {
    ...data,
    save: async () => {
      if (data.name === 'fail') {
        throw new Error('Project name is required');
      }
      return { ...data, _id: 'mock123' };
    },
  };
}

MockProject.findByIdAndUpdate = async (id, update, options) => {
  if (id === 'missing') return null;
  return {
    _id: id,
    status: update.status,
    lastUpdated: update.lastUpdated,
  };
};

export default MockProject;


