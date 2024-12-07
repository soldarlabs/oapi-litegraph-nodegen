import { LGraphNode, IWidget } from "litegraph.js";

export interface OapiOutputStatus {
  success: boolean;
  errorCode: number;
  recognizedOutputs: Record<string, any>;
  unrecognizedOutputs: Record<string, any>;
}

export interface OapiOutputProperties {
  status: OapiOutputStatus;
}


export class CustomOutputNode extends LGraphNode {
  static title = "Custom Output Node";

  properties: OapiOutputProperties;
  widgets?: IWidget[];

  constructor() {
    super();

    this.properties = {
      status: {
        success: false,
        errorCode: 0,
        recognizedOutputs: {},
        unrecognizedOutputs: {},
      }
    };

    this.title = "Custom Output Node";

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
      (value: string) => {
        try {
          this.properties.status.recognizedOutputs = JSON.parse(value);
        } catch (e) {
          console.warn("Invalid JSON for Recognized Outputs");
        }
      },
      { multiline: true }
    );

    this.addWidget(
      "text",
      "Unrecognized Outputs",
      JSON.stringify(this.properties.status.unrecognizedOutputs, null, 2),
      (value: string) => {
        try {
          this.properties.status.unrecognizedOutputs = JSON.parse(value);
        } catch (e) {
          console.warn("Invalid JSON for Unrecognized Outputs");
        }
      },
      { multiline: true }
    );

    this.size = [300, 200]; // Default node size
  }

  onExecute() {
    const response = this.getInputData(0);

    if (response) {
      // Update internal properties
      this.properties.status.success = response.success ?? false;
      this.properties.status.errorCode = response.errorCode ?? 0;
      this.properties.status.recognizedOutputs = response.recognizedOutputs ?? {};
      this.properties.status.unrecognizedOutputs = response.unrecognizedOutputs ?? {};

      // Update outputs
      this.setOutputData(0, this.properties.status.success);
      this.setOutputData(1, this.properties.status.errorCode);
      this.setOutputData(2, this.properties.status.recognizedOutputs);
      this.setOutputData(3, this.properties.status.unrecognizedOutputs);

      // Force widget updates
      this.widgets?.forEach((w: IWidget) => {
        switch (w.name) {
          case "Success (Green/Red)":
            w.value = this.properties.status.success;
            break;
          case "Error Code":
            w.value = this.properties.status.errorCode;
            break;
          case "Recognized Outputs":
            w.value = JSON.stringify(this.properties.status.recognizedOutputs, null, 2);
            break;
          case "Unrecognized Outputs":
            w.value = JSON.stringify(this.properties.status.unrecognizedOutputs, null, 2);
            break;
        }
      });

      // Mark canvas as dirty to trigger a redraw
      this.setDirtyCanvas(true, false);
    }
  }
}
