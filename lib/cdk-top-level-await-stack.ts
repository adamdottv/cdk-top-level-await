import { CfnOutput, Stack, StackProps } from "aws-cdk-lib"
import { Architecture, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda"
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"
import { Construct } from "constructs"

export class CdkTopLevelAwaitStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const superSecretSecret = new Secret(this, "SuperSecretSecret")

    const oldAndBustedFunction = new NodejsFunction(
      this,
      "OldAndBustedFuction",
      {
        entry: "./lib/functions/old-and-busted.ts",
        architecture: Architecture.ARM_64,
        environment: { SECRET_ARN: superSecretSecret.secretArn },
      }
    )

    const oldFunctionUrl = oldAndBustedFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })

    superSecretSecret.grantRead(oldAndBustedFunction)

    new CfnOutput(this, "OldFunctionUrl", {
      value: oldFunctionUrl.url,
    })

    const newAndShinyFunction = new NodejsFunction(
      this,
      "NewAndShinyFunction",
      {
        entry: "./lib/functions/new-and-shiny.ts",
        architecture: Architecture.ARM_64,
        environment: { SECRET_ARN: superSecretSecret.secretArn },
        bundling: {
          format: OutputFormat.ESM,
          target: "node14.8",
          nodeModules: ["@aws-sdk/client-secrets-manager"],
        },
      }
    )

    const newFunctionUrl = newAndShinyFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })

    superSecretSecret.grantRead(newAndShinyFunction)

    new CfnOutput(this, "NewFunctionUrl", {
      value: newFunctionUrl.url,
    })
  }
}
