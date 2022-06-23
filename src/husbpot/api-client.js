const hubspot = require("@hubspot/api-client");

const createClient = (apiKey) => new hubspot.Client({
    apiKey,
})

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

const getPipelines = async (hubspotClient, objectType) => {
    try {
        const apiResponse = await hubspotClient.crm.pipelines.pipelinesApi.getAll(objectType, false);
        return apiResponse.body.results;
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

const createGroups = async (hubspotClient, objectType, groups) => {
    return await Promise.all(
        groups.map(
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
    )
}

const createProperties = async (hubspotClient, objectType, properties) => {
    return await Promise.all(
        properties.map(
            async (property) => {
                try {
                    const apiResponse = await hubspotClient.crm.properties.coreApi.create(objectType, {
                        ...property,
                    });
                    return apiResponse.body
                } catch (e) {
                    e.message === 'HTTP request failed'
                        ? console.error(JSON.stringify(e.response, null, 2))
                        : console.error(e)
                }
            }
        )
    )
}

const createPipelinesProperties = async (hubspotClient, objectType, properties) => {
    return await Promise.all(
        properties.map(
            async (property) => {
                try {
                    const apiResponse = await hubspotClient.crm.pipelines.pipelinesApi.create(objectType, {
                        ...property,
                    });
                    return apiResponse.body
                } catch (e) {
                    e.message === 'HTTP request failed'
                        ? console.error(JSON.stringify(e.response, null, 2))
                        : console.error(e)
                }
            }
        )
    )
}

module.exports = {
    getGroups,
    getProperties,
    saveProperties: createProperties,
    saveGroups: createGroups,
    createClient,
    getPipelines,
    createPipelinesProperties,
}
