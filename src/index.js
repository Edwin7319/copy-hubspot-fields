const {createDealGroups, createContactGroups, createDealProperties, createContactProperties, createPipelines} = require('./main')

const main = async () => {
    // await createContactGroups()
    // await createDealGroups()
    // await createContactProperties()
    // await createDealProperties()
   const response = await createPipelines()
    console.log(JSON.stringify(response, null, 2))
}

main()