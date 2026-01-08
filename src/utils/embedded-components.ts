export default function getEmbeddedComponents() {
  return Object.fromEntries(
    Object.values(
      import.meta.glob("../components/embedded/*", {
        eager: true,
      }),
    ).map((module: any) => [module.default.name, module.default]), // FIXME: what the hell is the type
  );
}
