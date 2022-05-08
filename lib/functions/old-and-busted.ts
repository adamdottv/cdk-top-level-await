import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager"

const client = new SecretsManagerClient({})
const secretArn = process.env.SECRET_ARN

export const handler = async () => {
  const { SecretString: secret } = await client.send(
    new GetSecretValueCommand({ SecretId: secretArn })
  )

  return `Shhhhh, the secret is: ${secret}`
}
