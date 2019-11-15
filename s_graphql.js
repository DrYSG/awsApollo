var serverlessSDK = require('./serverless_sdk/index.js')
serverlessSDK = new serverlessSDK({
tenantId: 'ygutfreund',
applicationName: 'awsapollo',
appUid: 'hGwhKwj4PcBV3MYxHT',
tenantUid: 'y4jQk0ckJQNBvJ544j',
deploymentUid: 'ccd55426-e0b7-4005-ba46-1a3ac93517bd',
serviceName: 'apollo-lambda',
stageName: 'dev',
pluginVersion: '3.2.3'})
const handlerWrapperArgs = { functionName: 'apollo-lambda-dev-graphql', timeout: 6}
try {
  const userHandler = require('./server.js')
  module.exports.handler = serverlessSDK.handler(userHandler.graphqlHandler, handlerWrapperArgs)
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs)
}
