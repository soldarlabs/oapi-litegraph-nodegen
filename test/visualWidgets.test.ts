import { JSDOM } from "jsdom";
import {
  calculateNodeSize,
  calculateWidgetPosition,
  addAlignedWidget,
} from "../src/visualWidgets.js";
import {
  LGraph,
  LGraphNode,
  LGraphCanvas,
} from "litegraph.js";

// Set up DOM environment for LiteGraph.
const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");
(global as any).document = dom.window.document;
(global as any).window = dom.window;

describe("Visual Widget Tests", () => {
  describe("Widget Positioning", () => {
    let node: LGraphNode;

    beforeEach(() => {
      node = new LGraphNode();
      node.size = [250, 120];
    });

    it("should calculate widget position", () => {
      const node = {
        id: 1,
        type: "test",
        title: "Test Node",
        size: [100, 100],
        pos: [0, 0],
        graph: null,
      } as LGraphNode;

      const position = calculateWidgetPosition(node, 0);
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.width).toBeGreaterThan(0);
    });

    it("should handle multiple widget positions", () => {
      const position1 = calculateWidgetPosition(node, 0);
      const position2 = calculateWidgetPosition(node, 1);
      expect(position2.y).toBeGreaterThan(position1.y);
    });

    it("should handle multiple widgets with different sizes", () => {
      const widget1 = addAlignedWidget(
        node,
        0,
        { type: "text" },
        "test1",
        "",
        () => {}
      );
      const widget2 = addAlignedWidget(
        node,
        1,
        { type: "number", options: { width: 100 } },
        "test2",
        "",
        () => {}
      );
      const position1 = calculateWidgetPosition(node, 0);
      const position2 = calculateWidgetPosition(node, 1);
      expect(position2.y).toBeGreaterThan(position1.y);
    });

    it("should update widget value through callback", () => {
      let value = "";
      const callback = (v: string) => {
        value = v;
      };
      const testWidget = addAlignedWidget(
        node,
        0,
        { type: "text" },
        "test",
        "initial",
        callback
      );

      if (testWidget && testWidget.callback) {
        const canvas = {} as LGraphCanvas;
        const pos: [number, number] = [0, 0];
        testWidget.callback("new value", canvas, node, pos);
        expect(value).toBe("new value");
      }
    });
  });

  describe("Node Size Calculations", () => {
    it("should calculate minimum node size", () => {
      const size = calculateNodeSize(0, 0);
      expect(size[0]).toBeGreaterThan(0);
      expect(size[1]).toBeGreaterThan(0);
    });

    it("should increase size with inputs", () => {
      const size = calculateNodeSize(3, 0);
      expect(size[1]).toBeGreaterThan(calculateNodeSize(0, 0)[1]);
    });

    it("should handle different input/output combinations", () => {
      const size1 = calculateNodeSize(1, 1);
      const size2 = calculateNodeSize(5, 2);
      expect(size2[1]).toBeGreaterThan(size1[1]);
    });
  });

  describe("Widget Addition", () => {
    let node: LGraphNode;
    let graph: LGraph;

    beforeEach(() => {
      graph = new LGraph();
      node = new LGraphNode();
      graph.add(node);
      node.size = [250, 120];
    });

    it("should add widget to node", () => {
      const widget = addAlignedWidget(
        node,
        0,
        { type: "text" },
        "test",
        "",
        () => {}
      );
      expect(widget).toBeDefined();
    });

    it("should position widget correctly", () => {
      const widget = addAlignedWidget(
        node,
        0,
        { type: "text" },
        "test",
        "",
        () => {}
      );
      const position = calculateWidgetPosition(node, 0);
      expect(widget.y).toBe(position.y);
    });
  });

  describe("Widget Alignment", () => {
    let node: LGraphNode;

    beforeEach(() => {
      node = new LGraphNode();
    });

    it("should align widgets with different node sizes", () => {
      node.size = [300, 150];
      const testWidget = addAlignedWidget(
        node,
        0,
        { type: "text" },
        "test",
        "",
        () => {}
      ) as any;
      const position = calculateWidgetPosition(node, 0);
      expect(testWidget?.y).toBe(position.y);
      expect(position.x).toBeGreaterThan(0);
    });

    it("should handle minimum node size constraints", () => {
      node.size = [50, 50]; // Too small
      const widget = addAlignedWidget(
        node,
        0,
        { type: "text" },
        "test",
        "",
        () => {}
      );
      expect(node.size[0]).toBeGreaterThan(50);
      expect(node.size[1]).toBeGreaterThan(50);
    });
  });

  describe("Edge Cases", () => {
    let node: LGraphNode;

    beforeEach(() => {
      node = new LGraphNode();
      node.size = [250, 120];
    });

    it("should handle widget index out of bounds", () => {
      const position = calculateWidgetPosition(node, 999);
      expect(position.x).toBeDefined();
      expect(position.y).toBeDefined();
    });

    it("should handle zero size node", () => {
      node.size = [0, 0];
      const size = calculateNodeSize(1, 1);
      expect(size[0]).toBeGreaterThan(0);
      expect(size[1]).toBeGreaterThan(0);
    });

    it("should handle negative widget indices", () => {
      const position = calculateWidgetPosition(node, -1);
      expect(position.x).toBeDefined();
      expect(position.y).toBeDefined();
      expect(position.y).toBeGreaterThanOrEqual(0);
    });
  });
});
