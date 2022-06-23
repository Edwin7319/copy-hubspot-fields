const {API_KEY_PRINCIPAL, API_KEY_SECONDARY} = require('./constants/config')
const {getGroups, getProperties, saveGroups, saveProperties, createClient, getPipelines, createPipelinesProperties} = require('./husbpot/api-client')
const {getDifferenceBetweenArrays, prepareGroupToSave, preparePropertiesToSave, removeHubspotDefaultFields} = require('./helper/hubspot-helper')

const hubspotClientPrincipal = createClient(API_KEY_PRINCIPAL)
const hubspotClientSecondary = createClient(API_KEY_SECONDARY)

const createGroups = async (objectType) => {
    const groupsPrincipal = await getGroups(hubspotClientPrincipal, objectType)
    const groupsSecondary = await getGroups(hubspotClientSecondary, objectType)
    const uniqueFields = getDifferenceBetweenArrays(groupsSecondary, groupsPrincipal, 'name')
    const cleanedUniqueFields = removeHubspotDefaultFields(uniqueFields)
    const fieldsToSave = prepareGroupToSave(cleanedUniqueFields)
    return saveGroups(hubspotClientSecondary, objectType, fieldsToSave)
}

const createProperties = async (objectType) => {
    const contactFieldsPrincipal = await getProperties(hubspotClientPrincipal, objectType)
    const contactFieldsSecondary = await getProperties(hubspotClientSecondary, objectType)
    const uniqueFields = getDifferenceBetweenArrays(contactFieldsSecondary, contactFieldsPrincipal, 'name')
    const cleanedUniqueFields = removeHubspotDefaultFields(uniqueFields)
    const fieldsToSave = preparePropertiesToSave(cleanedUniqueFields)
    console.log(fieldsToSave)
    return saveProperties(hubspotClientSecondary, objectType, fieldsToSave)
}

const createPipelines = async () => {
    const resp = await getPipelines(hubspotClientPrincipal, 'deals')
    await createPipelinesProperties(hubspotClientSecondary, 'deals', resp)
}


const createContactGroups = async () => {
    const contactsObjectType = "contacts";
    await createGroups(contactsObjectType)
}

const createContactProperties = async () => {
    const contactsObjectType = "contacts";
    await createProperties(contactsObjectType)
}

const createDealGroups = async () => {
    const contactsObjectType = "deals";
    await createGroups(contactsObjectType)
}

const createDealProperties = async () => {
    const contactsObjectType = "deals";
   await createProperties(contactsObjectType)
}


module.exports = {
    createContactGroups,
    createContactProperties,
    createDealGroups,
    createDealProperties,
    createPipelines,
}