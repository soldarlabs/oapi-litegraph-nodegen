import { getWidgetConfigForParameter } from "../src/nodes/widgets/utils";
import { SchemaObject } from "openapi-typescript";

describe("Widget Parameter Mapping", () => {
  describe("String Type Parameters", () => {
    it("should return text widget for basic string", () => {
      const schema = { type: "string" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
    });

    it("should return text widget with placeholder for date format", () => {
      const schema = { type: "string", format: "date" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.placeholder).toBe("YYYY-MM-DD");
    });

    it("should return text widget with placeholder for email format", () => {
      const schema = { type: "string", format: "email" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.placeholder).toBe("email@example.com");
    });

    it("should return text widget with password option", () => {
      const schema = { type: "string", format: "password" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.password).toBe(true);
    });

    it("should return combo widget for enum values", () => {
      const schema = { type: "string", enum: ["one", "two", "three"] } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema) ;
      expect(widget.type).toBe("combo");
      expect(widget.options?.values).toEqual(["one", "two", "three"]);
    });
  });

  describe("Number Type Parameters", () => {
    it("should return number widget for integer", () => {
      const schema = { type: "integer" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("number");
      expect(widget.options?.precision).toBe(0);
    });

    it("should return number widget for number", () => {
      const schema = { type: "number" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("number");
      expect(widget.options?.precision).toBe(3);
    });

    it("should set min and max for number with range", () => {
      const schema = {
        type: "number",
        minimum: 0,
        maximum: 100,
      } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("slider");
      expect(widget.options?.min).toBe(0);
      expect(widget.options?.max).toBe(100);
    });
  });

  describe("Boolean Type Parameters", () => {
    it("should return toggle widget for boolean", () => {
      const schema = { type: "boolean" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("toggle");
    });
  });

  describe("Array Type Parameters", () => {
    it("should return text widget for array type", () => {
      const schema = { type: "array", items: { type: "string" } } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.placeholder).toBe("comma,separated,values");
    });

    it("should return combo widget for array with enum", () => {
      const schema = {
        type: "array",
        items: {
          enum: ["one", "two", "three"],
        },
      } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("combo");
      expect(widget.options?.values).toEqual(["one", "two", "three"]);
      expect(widget.options?.multiple).toBe(true);
    });
  });

  describe("Object Type Parameters", () => {
    it("should return text widget for object", () => {
      const schema = { type: "object" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.placeholder).toBe('{"key": "value"}');
    });
  });

  describe("Binary Type Parameters", () => {
    it("should return file widget for binary format", () => {
      const schema = { type: "string", format: "binary" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("file");
    });

    it("should return file widget with specific mime types", () => {
      const schema = {
        type: "string",
        format: "binary",
        contentMediaType: "image/*",
      } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("file");
      expect(widget.options?.accept).toBe("image/*");
    });
  });

  describe("Custom Format Parameters", () => {
    it("should return text widget with uri placeholder", () => {
      const schema = { type: "string", format: "uri" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.placeholder).toBe("https://example.com");
    });

    it("should return text widget with datetime placeholder", () => {
      const schema = { type: "string", format: "date-time" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.placeholder).toBe("YYYY-MM-DDTHH:mm:ssZ");
    });
  });

  describe("Combined Schema Types", () => {
    it("should handle allOf schema combination", () => {
      const schema = {
        allOf: [{ type: "string" }, { enum: ["one", "two", "three"] }],
      } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("combo");
      expect(widget.options?.values).toEqual(["one", "two", "three"]);
    });

    it("should handle oneOf schema with enum values", () => {
      const schema = {
        oneOf: [{ enum: ["a", "b"] }, { enum: ["c", "d"] }],
      } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("combo");
      expect(widget.options?.values).toEqual(["a", "b", "c", "d"]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty schema", () => {
      const schema = {} as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
    });

    it("should handle schema with only title", () => {
      const schema = { title: "Test Input" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.name).toBe("Test Input");
    });

    it("should handle null type", () => {
      const schema = { type: "null" } as SchemaObject;
      const widget = getWidgetConfigForParameter(schema);
      expect(widget.type).toBe("text");
      expect(widget.options?.disabled).toBe(true);
    });
  });
});
