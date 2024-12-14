import { LGraphNode, IWidget, LiteGraph } from "litegraph.js";
import { logger } from "../../utils/logger.js";

export interface OapiOutputStatus {
  success: boolean;
  data: any;
  error?: string;
  contentType?: string;
  responseType?: string;
}

export interface OapiOutputProperties {
  status: OapiOutputStatus;
}

export class CustomOutputNode extends LGraphNode {
  static title = "API Output Node";

  properties: OapiOutputProperties;
  widgets?: IWidget[];

  constructor() {
    super();

    // Set to trigger mode - only execute when triggered
    this.mode = LiteGraph.ON_EVENT;

    this.properties = {
      status: {
        success: false,
        data: null,
        error: undefined,
        contentType: undefined,
        responseType: undefined
      }
    };

    this.title = "API Output Node";

    // Add trigger input
    this.addInput("trigger", LiteGraph.EVENT);
    
    // Add input for API response
    this.addInput("API Response", "*");

    // Add outputs for different response types
    this.addOutput("Success", "boolean");
    this.addOutput("Response Data", "*");
    this.addOutput("Error", "string");

    // Add widgets for displaying response details
    this.addWidget(
      "toggle",
      "Success",
      this.properties.status.success,
      "properties.status.success",
      {
        bg: undefined,
        color: (value: boolean) => (value ? "#00FF00" : "#FF0000"),
        readonly: true,
      }
    );

    this.addWidget(
      "text",
      "Content Type",
      "",
      () => {},
      {
        readonly: true,
      }
    );

    this.addWidget(
      "text",
      "Response Type",
      "",
      () => {},
      {
        readonly: true,
      }
    );

    this.addWidget(
      "text",
      "Response Data",
      "",
      () => {},
      {
        multiline: true,
        readonly: true,
      }
    );

    this.addWidget(
      "text",
      "Error",
      "",
      () => {},
      {
        multiline: true,
        readonly: true,
        color: "#FF0000"
      }
    );

    this.size = [350, 200];
  }

  // Handle trigger events
  onAction(action: string) {
    if (action === "onComplete") {
      this.onExecute();
    }
  }

  onExecute() {
    const response = this.getInputData(0);

    logger.debug('Output node received data:', {
      component: 'OapiOutputNode',
      response,
      type: typeof response,
      isArray: Array.isArray(response)
    });

    if (response !== undefined) {
      // Handle error responses
      if (response && response.error) {
        this.properties.status.success = false;
        this.properties.status.error = response.error;
        this.properties.status.data = null;
      } else {
        // Handle successful responses
        this.properties.status.success = true;
        this.properties.status.error = undefined;
        this.properties.status.data = response;
        
        // Determine response type
        this.properties.status.responseType = Array.isArray(response) ? 'array' :
          typeof response === 'object' ? 'object' : typeof response;
      }

      // Update outputs
      this.setOutputData(0, this.properties.status.success);
      this.setOutputData(1, this.properties.status.data);
      this.setOutputData(2, this.properties.status.error);

      // Update widgets with formatted data
      this.widgets?.forEach((w: IWidget) => {
        switch (w.name) {
          case "Success":
            w.value = this.properties.status.success;
            break;
          case "Content Type":
            w.value = this.properties.status.contentType || "N/A";
            break;
          case "Response Type":
            w.value = this.properties.status.responseType || typeof response;
            break;
          case "Response Data":
            w.value = typeof response === 'object' ? 
              JSON.stringify(response, null, 2) : String(response);
            break;
          case "Error":
            w.value = this.properties.status.error || "";
            break;
        }
      });

      // Mark canvas as dirty to trigger a redraw
      this.setDirtyCanvas(true, true);
    }
  }
}
