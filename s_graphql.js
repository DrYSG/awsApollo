var serverlessSDK = require('./serverless_sdk/index.js')
serverlessSDK = new serverlessSDK({
tenantId: 'ygutfreund',
applicationName: 'awsapollo',
appUid: 'hGwhKwj4PcBV3MYxHT',
tenantUid: 'y4jQk0ckJQNBvJ544j',
deploymentUid: '3e682d00-6fb3-4cec-957b-d4859ca90d24',
serviceName: 'apollo-lambda',
stageName: 'beta',
pluginVersion: '3.2.3'})
const handlerWrapperArgs = { functionName: 'apollo-lambda-beta-graphql', timeout: 6}
try {
  const userHandler = require('./server.js')
  module.exports.handler = serverlessSDK.handler(userHandler.graphqlHandler, handlerWrapperArgs)
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs)
}
