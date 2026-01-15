type Primitive = "string" | "number" | "boolean" | "undefined" | "null";

function isInstanceOf(data: any, type: Primitive) {
  switch (type) {
    case "null":
      return data === null;
    default:
      return typeof data == type;
  }
}

export default function verifyForm<T extends { [key: string]: any }>(
  data: T,
  {
    expectedTypes,
    ignoreUnknownKeys = false,
  }: {
    expectedTypes: {
      [key in keyof T]: Primitive | Primitive[];
    };
    ignoreUnknownKeys?: boolean;
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
      (typeof expectedType === "string" &&
        !isInstanceOf(value, expectedType)) ||
      (Array.isArray(expectedType) &&
        !expectedType.find((t) => isInstanceOf(value, t)))
    ) {
      throw new Error(`Invalid ${key}`, {
        cause: new Error(
          `Expected type: ${expectedType}, actual: ${typeof value}`,
        ),
      });
    }
  }
}
