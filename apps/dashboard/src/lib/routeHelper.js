export const onModelChange = (path, router, model) => {
  if (path?.includes('dynamic-review') && model) {
    return router.push('dynamic-review?modelId=' + model.id);
  }
  if (path?.includes('monitoring/') && model) {
    return router.push('/monitoring/' + model.id);
  }
  if (path?.includes('model-refinement') && model) {
    return router.push('/model-refinement?modelId=' + model.id);
  }
  if (path?.includes('automated-insights') && model) {
    return router.push('/automated-insights?modelId=' + model.id);
  }
};