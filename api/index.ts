import serverless from 'serverless-http'
import app from "../src/index"
import swaggerDefinition from './docs/app'

export default serverless(app)
