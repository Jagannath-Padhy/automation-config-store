import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";

import { SessionData } from "../../../../session-types";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";
import { initUnlimitedPassGenerator } from "./generator";

export class MockInitUnlimitedPassBus210Class extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./save-data.yaml"), "utf8")
    ) as saveType;
  }
  get defaultData(): any {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./default.yaml"), "utf8")
    );
  }
  get inputs(): any {
    return {};
  }
  name(): string {
    return "init_BUS_Unlimited_Passes_210";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return initUnlimitedPassGenerator(existingPayload, sessionData);
  }
  get description(): string {
    return "Mock for init_BUS_Unlimited_Passes_210";
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData
  ): Promise<MockOutput> {

    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {

  return { valid: true };
}
}
