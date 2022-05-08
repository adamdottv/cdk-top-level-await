import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager"

const client = new SecretsManagerClient({})
const secretArn = process.env.SECRET_ARN
const { SecretString: secret } = await client.send(
  new GetSecretValueCommand({ SecretId: secretArn })
)

export const handler = () => {
  return `Shhhhh, the secret is: ${secret}`
}
