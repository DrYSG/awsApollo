var serverlessSDK = require('./serverless_sdk/index.js')
serverlessSDK = new serverlessSDK({
tenantId: 'ygutfreund',
applicationName: 'awsapollo',
appUid: 'hGwhKwj4PcBV3MYxHT',
tenantUid: 'y4jQk0ckJQNBvJ544j',
deploymentUid: '4873758c-f1f0-4442-b90f-54be7c03bcaf',
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
