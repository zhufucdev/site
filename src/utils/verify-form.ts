type Primitive = "string" | "number" | "boolean" | "undefined";

export default function verifyForm(
  data: any,
  {
    expectedTypes,
    ignoreUnknownKeys,
  }: {
    expectedTypes: {
      [key: string]: Primitive | Primitive[];
    };
    ignoreUnknownKeys: boolean;
  },
) {
  const uncheckedTypes = { ...expectedTypes };
  for (const [key, value] of Object.entries(data)) {
    const expectedType = uncheckedTypes[key];
    if (typeof expectedType === "undefined") {
      if (!ignoreUnknownKeys) {
        throw new Error(`Unexpected key: ${key}`);
      } else {
        continue;
      }
    }
    if (
      (typeof expectedType === "string" && typeof value !== expectedType) ||
      !expectedType.includes(typeof value as Primitive)
    ) {
      throw new Error(`Invalid ${key}`, {
        cause: new Error(
          `Expected type: ${expectedType}, actual: ${typeof value}`,
        ),
      });
    }
  }
}
