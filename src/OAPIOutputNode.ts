import { LGraphNode, IWidget, LiteGraph } from "litegraph.js";

export class CustomOutputNode extends LGraphNode {
  static title = "Custom Output Node";

  properties: {
    status: {
      success: boolean;
      errorCode: number;
      recognizedOutputs: Record<string, any>;
      unrecognizedOutputs: Record<string, any>;
    };
  };

  constructor() {
    super();

    this.properties = {
      status: {
        success: false,
        errorCode: 0,
        recognizedOutputs: {},
        unrecognizedOutputs: {},
      },
    };

    this.title = "Output Node";

    // Add inputs
    this.addInput("Response (Object)", "object");

    // Add outputs
    this.addOutput("Success", "boolean");
    this.addOutput("Error Code", "number");
    this.addOutput("Recognized Outputs", "object");
    this.addOutput("Unrecognized Outputs", "object");

    // Add widgets
    this.addWidget(
      "toggle",
      "Success (Green/Red)",
      false,
      (value: boolean) => {
        this.properties.status.success = value;
        this.setDirtyCanvas(true, false);
      },
      { bg: undefined, color: (value: boolean) => (value ? "#00FF00" : "#FF0000") }
    );

    this.addWidget(
      "number",
      "Error Code",
      0,
      (value: number) => {
        this.properties.status.errorCode = value;
      },
      { precision: 0 }
    );

    this.addWidget(
      "text",
      "Recognized Outputs",
      JSON.stringify(this.properties.status.recognizedOutputs, null, 2),
      undefined,
      { multiline: true }
    );

    this.addWidget(
      "text",
      "Unrecognized Outputs",
      JSON.stringify(this.properties.status.unrecognizedOutputs, null, 2),
      undefined,
      { multiline: true }
    );

    this.size = [300, 200]; // Default node size
  }

  onExecute() {
    const response = this.getInputData(0);

    if (response) {
      this.properties.status.success = response.success ?? false;
      this.properties.status.errorCode = response.errorCode ?? 0;
      this.properties.status.recognizedOutputs = response.recognizedOutputs ?? {};
      this.properties.status.unrecognizedOutputs = response.unrecognizedOutputs ?? {};

      // Update outputs
      this.setOutputData(0, this.properties.status.success);
      this.setOutputData(1, this.properties.status.errorCode);
      this.setOutputData(2, this.properties.status.recognizedOutputs);
      this.setOutputData(3, this.properties.status.unrecognizedOutputs);
    }
  }
}
