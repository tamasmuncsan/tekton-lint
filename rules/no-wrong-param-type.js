const checkParameterValues = (resourceName, resourceKind, params, report) => {
  for (const param of params) {
    const value = typeof param.default !== 'undefined' ? param.default : param.value;
    if (value != null) {
      if (typeof value === 'string') continue;
      if (Array.isArray(value) && value.every(element => typeof element === 'string')) continue;
      report(`${resourceKind} '${resourceName}' defines parameter '${param.name}' with wrong type (only strings and arrays of strings are allowed)`, param);
    }
  }
};

function getTaskParams(spec) {
  if (spec.inputs) return spec.inputs.params;
  return spec.params;
}

module.exports = (docs, tekton, report) => {
  for (const task of Object.values(tekton.tasks)) {
    const params = getTaskParams(task.spec);
    if (!params) continue;
    checkParameterValues(task.metadata.name, task.kind, params, report);
  }

  for (const template of Object.values(tekton.triggerTemplates)) {
    if (!template.spec.params) continue;
    checkParameterValues(template.metadata.name, template.kind, template.spec.params, report);
  }

  for (const pipeline of Object.values(tekton.pipelines)) {
    if (!pipeline.spec.params) continue;
    checkParameterValues(pipeline.metadata.name, pipeline.kind, pipeline.spec.params, report);
  }
};
