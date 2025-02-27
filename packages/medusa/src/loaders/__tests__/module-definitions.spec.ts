// import resolveCwd from "resolve-cwd"
import { ConfigModule } from "../../types/global"
import ModuleDefinitionLoader from "../module-definitions"
import MODULE_DEFINITIONS from "../module-definitions/definitions"

const RESOLVED_PACKAGE = "@medusajs/test-service-resolved"
jest.mock("resolve-cwd", () => jest.fn(() => RESOLVED_PACKAGE))

describe("module definitions loader", () => {
  const defaultDefinition = {
    key: "testService",
    registrationName: "testService",
    defaultPackage: "@medusajs/test-service",
    label: "TestService",
    isRequired: false,
    canOverride: true,
  }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    // Clear module definitions
    MODULE_DEFINITIONS.splice(0, MODULE_DEFINITIONS.length)
  })

  it("Resolves module with default definition given empty config", () => {
    MODULE_DEFINITIONS.push({ ...defaultDefinition })

    const res = ModuleDefinitionLoader({ modules: {} } as ConfigModule)

    expect(res[defaultDefinition.key]).toEqual({
      resolutionPath: defaultDefinition.defaultPackage,
      definition: defaultDefinition,
      options: {},
    })
  })

  describe("boolean config", () => {
    it("Resolves module with no resolution path when given false", () => {
      MODULE_DEFINITIONS.push({ ...defaultDefinition })

      const res = ModuleDefinitionLoader({
        modules: { [defaultDefinition.key]: false },
      } as ConfigModule)

      expect(res[defaultDefinition.key]).toEqual({
        resolutionPath: false,
        definition: defaultDefinition,
        options: {},
      })
    })

    it("Fails to resolve module with no resolution path when given false for a required module", () => {
      expect.assertions(1)
      MODULE_DEFINITIONS.push({ ...defaultDefinition, isRequired: true })

      try {
        ModuleDefinitionLoader({
          modules: { [defaultDefinition.key]: false },
        } as ConfigModule)
      } catch (err) {
        expect(err.message).toEqual(
          `Module: ${defaultDefinition.label} is required`
        )
      }
    })

    it("Resolves module with no resolution path when not given custom resolution path as false as default package", () => {
      const definition = {
        ...defaultDefinition,
        defaultPackage: false as false,
      }

      MODULE_DEFINITIONS.push(definition)

      const res = ModuleDefinitionLoader({
        modules: {},
      } as ConfigModule)

      expect(res[defaultDefinition.key]).toEqual({
        resolutionPath: false,
        definition: definition,
        options: {},
      })
    })
  })

  describe("string config", () => {
    it("Resolves module with default definition given empty config", () => {
      MODULE_DEFINITIONS.push({ ...defaultDefinition })

      const res = ModuleDefinitionLoader({
        modules: {
          [defaultDefinition.key]: defaultDefinition.defaultPackage,
        },
      } as ConfigModule)

      expect(res[defaultDefinition.key]).toEqual({
        resolutionPath: RESOLVED_PACKAGE,
        definition: defaultDefinition,
        options: {},
      })
    })
  })

  describe("object config", () => {
    it("Resolves resolution path and provides empty options when none are provided", () => {
      MODULE_DEFINITIONS.push({ ...defaultDefinition })

      const res = ModuleDefinitionLoader({
        modules: {
          [defaultDefinition.key]: {
            resolve: defaultDefinition.defaultPackage,
          },
        },
      } as ConfigModule)

      expect(res[defaultDefinition.key]).toEqual({
        resolutionPath: RESOLVED_PACKAGE,
        definition: defaultDefinition,
        options: {},
      })
    })

    it("Resolves default resolution path and provides options when only options are provided", () => {
      MODULE_DEFINITIONS.push({ ...defaultDefinition })

      const res = ModuleDefinitionLoader({
        modules: {
          [defaultDefinition.key]: {
            options: { test: 123 },
          },
        },
      } as unknown as ConfigModule)

      expect(res[defaultDefinition.key]).toEqual({
        resolutionPath: defaultDefinition.defaultPackage,
        definition: defaultDefinition,
        options: { test: 123 },
      })
    })

    it("Resolves resolution path and provides options when only options are provided", () => {
      MODULE_DEFINITIONS.push({ ...defaultDefinition })

      const res = ModuleDefinitionLoader({
        modules: {
          [defaultDefinition.key]: {
            resolve: defaultDefinition.defaultPackage,
            options: { test: 123 },
          },
        },
      } as unknown as ConfigModule)

      expect(res[defaultDefinition.key]).toEqual({
        resolutionPath: RESOLVED_PACKAGE,
        definition: defaultDefinition,
        options: { test: 123 },
      })
    })
  })
})
