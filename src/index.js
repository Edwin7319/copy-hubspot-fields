const hubspot = require('@hubspot/api-client')
const {API_KEY_PRINCIPAL, API_KEY_SECONDARY} = require('./constants/config')


const hubspotClientPrincipal = new hubspot.Client({
    apiKey: API_KEY_PRINCIPAL,
})

const hubspotClientSecondary = new hubspot.Client({
    apiKey: API_KEY_SECONDARY,
})

const createContactGroups = async () => {
    const contactsObjectType = "contacts";
    const groups = await createGroups(contactsObjectType)
    console.log(groups)
}

const createContactProperties = async () => {
    const contactsObjectType = "contacts";
    const properties = await createProperties(contactsObjectType)
    console.log(properties)
}

const createDealProperties = async () => {
    const contactsObjectType = "deals";
    const properties = await createProperties(contactsObjectType)
    console.log(properties)
}

const createDealGroups = async () => {
    const contactsObjectType = "deals";
    const groups = await createGroups(contactsObjectType)
    console.log(groups)
}

const createGroups = async (contactsObjectType) => {
    const groupsPrincipal = await getGroups(hubspotClientPrincipal, contactsObjectType)
    const groupsSecondary = await getGroups(hubspotClientSecondary, contactsObjectType)
    const uniqueFields = getDifferenceBetweenArrays(groupsSecondary, groupsPrincipal, 'name')
    const cleanedUniqueFields = removeHubspotDefaultFields(uniqueFields)
    const fieldsToSave = prepareGroupToSave(cleanedUniqueFields)
    return await saveGroups(hubspotClientSecondary, contactsObjectType, fieldsToSave)
}

const createProperties = async (contactsObjectType) => {
    const contactFieldsPrincipal = await getProperties(hubspotClientPrincipal, contactsObjectType)
    const contactFieldsSecondary = await getProperties(hubspotClientSecondary, contactsObjectType)
    const uniqueFields = getDifferenceBetweenArrays(contactFieldsSecondary, contactFieldsPrincipal, 'name')
    const cleanedUniqueFields = removeHubspotDefaultFields(uniqueFields)
    const fieldsToSave = preparePropertiesToSave(cleanedUniqueFields)
    return await saveProperties(hubspotClientSecondary, contactsObjectType, fieldsToSave)
}

const getGroups = async (hubspotClient, objectType) => {
    try {
        const apiResponse = await hubspotClient.crm.properties.groupsApi.getAll(objectType);
        return apiResponse.body.results;
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

const getProperties = async (hubspotClient, objectType) => {
    try {
        const apiResponse = await hubspotClient.crm.properties.coreApi.getAll(objectType, false);
        return apiResponse.body.results;
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

const saveGroups = async (hubspotClient, objectType, groups) => {
    const groupsCreated = groups.map(
        async (group) => {
            try {
                const apiResponse = await hubspotClient.crm.properties.groupsApi.create(objectType, {
                    ...group,
                });
                return apiResponse.body
            } catch (e) {
                e.message === 'HTTP request failed'
                    ? console.error(JSON.stringify(e.response, null, 2))
                    : console.error(e)
            }
        }
    )
    return Promise.all(groupsCreated)
}

const saveProperties = async (hubspotClient, objectType, properties) => {
    const propertiesCreated = properties.map(
        async (propertie) => {
            try {
                const apiResponse = await hubspotClient.crm.properties.coreApi.create(objectType, {
                    ...propertie,
                });
                return apiResponse.body
            } catch (e) {
                e.message === 'HTTP request failed'
                    ? console.error(JSON.stringify(e.response, null, 2))
                    : console.error(e)
            }
        }
    )
    return Promise.all(propertiesCreated)
}

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

const getDifferenceBetweenArrays = (secondary, principal, keyToCompare) => {
    return principal.filter((principalA) => {
        return secondary.filter((secondaryA) => {
            return principalA[keyToCompare] === secondaryA[keyToCompare]
        }).length === 0
    })
}

const removeHubspotDefaultFields = (fields) => fields.filter((field) => !field.name.includes('hs_'))

