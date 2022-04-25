const preparePropertiesToSave = (properties) => {
    return properties.map((property) => ({
        name: property.name,
        label: property.label,
        type: property.type,
        fieldType: property.fieldType,
        groupName: property.groupName,
        description: property.description,
        options: property.options,
        displayOrder: property.displayOrder,
        hasUniqueValue: property.hasUniqueValue,
        hidden: property.hidden,
        formField: property.formField,
    }))
}

const prepareGroupToSave = (groups) => {
    return groups.map((group) => ({
        name: group.name,
        label: group.label,
        displayOrder: group.displayOrder
    }))
}

const preparePipelineToSave = (pipelines) => {
    return pipelines.map((pipeline) => ({
        label: pipeline.label,
        displayOrder: pipeline.displayOrder,
        stages: pipeline.stages.map(stage => ({
            label: stage.label,
            displayOrder: stage.displayOrder,
            metadata: stage.metadata,
        }))

    }))
}

const getDifferenceBetweenArrays = (secondary, principal, keyToCompare) => {
    return principal.filter((principalA) => {
        return secondary.filter((secondaryA) => {
            return principalA[keyToCompare] === secondaryA[keyToCompare]
        }).length === 0
    })
}

const removeHubspotDefaultFields = (fields) => fields.filter((field) => !field.name.includes('hs_'))

module.exports = {
    preparePropertiesToSave,
    prepareGroupToSave,
    getDifferenceBetweenArrays,
    removeHubspotDefaultFields,
}