const {API_KEY_PRINCIPAL, API_KEY_SECONDARY} = require('./constants/config')
const {getGroups, getProperties, saveGroups, saveProperties, createClient, getPipelines} = require('./husbpot/api-client')
const {getDifferenceBetweenArrays, prepareGroupToSave, preparePropertiesToSave, removeHubspotDefaultFields} = require('./helper/hubspot-helper')

const hubspotClientPrincipal = createClient(API_KEY_PRINCIPAL)
const hubspotClientSecondary = createClient(API_KEY_SECONDARY)

const createGroups = async (objectType) => {
    const groupsPrincipal = await getGroups(hubspotClientPrincipal, objectType)
    const groupsSecondary = await getGroups(hubspotClientSecondary, objectType)
    const uniqueFields = getDifferenceBetweenArrays(groupsSecondary, groupsPrincipal, 'name')
    const cleanedUniqueFields = removeHubspotDefaultFields(uniqueFields)
    const fieldsToSave = prepareGroupToSave(cleanedUniqueFields)
    return await saveGroups(hubspotClientSecondary, objectType, fieldsToSave)
}

const createProperties = async (objectType) => {
    const contactFieldsPrincipal = await getProperties(hubspotClientPrincipal, objectType)
    const contactFieldsSecondary = await getProperties(hubspotClientSecondary, objectType)
    const uniqueFields = getDifferenceBetweenArrays(contactFieldsSecondary, contactFieldsPrincipal, 'name')
    const cleanedUniqueFields = removeHubspotDefaultFields(uniqueFields)
    const fieldsToSave = preparePropertiesToSave(cleanedUniqueFields)
    return await saveProperties(hubspotClientSecondary, objectType, fieldsToSave)
}

const createPipelines = async () => {
    return await getPipelines(hubspotClientPrincipal, 'deals')
}


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

const createDealGroups = async () => {
    const contactsObjectType = "deals";
    const groups = await createGroups(contactsObjectType)
    console.log(groups)
}

const createDealProperties = async () => {
    const contactsObjectType = "deals";
    const properties = await createProperties(contactsObjectType)
    console.log(properties)
}


module.exports = {
    createContactGroups,
    createContactProperties,
    createDealGroups,
    createDealProperties,
    createPipelines,
}