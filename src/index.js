const {createDealGroups, createContactGroups, createDealProperties, createContactProperties, createPipelines} = require('./main')

const main = async () => {
    // await createPipelines()
    await createContactGroups()
    await createDealGroups()
    await createContactProperties()
    await createDealProperties()
}

main()