export const swaggerOptions = {
  routePrefix: "/docs",
  swagger: {
    info: {
      title: "Tamang Gastos API",
      description: "API documentation with for Tamang Gastos API endpoints",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
  },
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  transform: (swaggerObject) => {
    return swaggerObject; // Optionally transform the swagger object before serving it
  },
};
