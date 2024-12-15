import { LGraphNode, IWidget, LiteGraph } from "litegraph.js";
import { logger } from "../../utils/logger.js";

export class CustomOutputNode extends LGraphNode {
  static title = "API Output Node";

  widgets: IWidget[] = []; // Initialize widgets array

  constructor() {
    super();
    this.properties = {
      status: {
        success: false,
        data: null,
        error: undefined,
      }
    };

    this.title = "API Output Node";
    
    // Add input for API response
    this.addInput("API Response", "*");

    // Add outputs for different response types
    this.addOutput("Success", "boolean");
    this.addOutput("Response Data", "*");
    this.addOutput("Error", "string");

    // Initialize widgets array with our widgets
    this.widgets = [
      this.addWidget(
        "toggle",
        "Success",
        this.properties.status.success,
        "success",
        {
          bg: undefined,
          color: (value: boolean) => (value ? "#00FF00" : "#FF0000"),
          readonly: true,
        }
      ),
      this.addWidget(
        "text",
        "Response Data",
        "",
        "data",
        {
          multiline: true,
          readonly: true,
        }
      ),
      this.addWidget(
        "text",
        "Error",
        "",
        "error",
        {
          multiline: true,
          readonly: true,
        }
      )
    ];
  }

  onExecute() {
    this.mode = LiteGraph.ALWAYS
    try {
      // Get the API response from input
      const response = this.getInputData(0);

      logger.debug("Output node executing:", {
        component: "OapiOutputNode",
        hasResponse: !!response,
        isError: !!response?.error,
      });

      if (!response) {
        return;
      }

      // Check if response is an error
      if (response.error) {
        this.handleError(response.error);
        return;
      }

      // Parse and process the response
      this.processResponse(response);

    } catch (err) {
      const error = err as Error;
      logger.error("Error processing API response", {
        component: "OapiOutputNode",
        error: error.message,
        stack: error.stack
      });
      this.handleError(error.message);
    }
  }

  private processResponse(response: any) {
    logger.debug("Processing response:", {
      component: "OapiOutputNode",
      responseType: typeof response,
      isArray: Array.isArray(response),
    });

    // Update properties
    this.properties.status.success = true;
    this.properties.status.error = undefined;
    this.properties.status.data = response;

    // Update widgets if they exist
    if (this.widgets.length >= 3) {
      const [successWidget, dataWidget, errorWidget] = this.widgets;
      
      if (successWidget && dataWidget && errorWidget) {
        successWidget.value = true;
        dataWidget.value = this.formatResponseData(response);
        errorWidget.value = "";

        logger.debug("Updated widgets:", {
          component: "OapiOutputNode",
          success: successWidget.value
        });
      }
    }

    // Set output values
    this.setOutputData(0, true); // Success
    this.setOutputData(1, response); // Response Data
    this.setOutputData(2, null); // Error
  }

  private handleError(error: string) {
    // Update properties
    this.properties.status.success = false;
    this.properties.status.error = error;
    this.properties.status.data = null;

    // Update widgets if they exist
    if (this.widgets.length >= 3) {
      const [successWidget, dataWidget, errorWidget] = this.widgets;
      
      if (successWidget && dataWidget && errorWidget) {
        successWidget.value = false;
        dataWidget.value = "";
        errorWidget.value = error;
      }
    }

    // Set output values
    this.setOutputData(0, false); // Success
    this.setOutputData(1, null); // Response Data
    this.setOutputData(2, error); // Error
  }

  private formatResponseData(response: any): string {
    try {
      if (typeof response === 'object') {
        return JSON.stringify(response, null, 2);
      }
      return String(response);
    } catch {
      return String(response);
    }
  }
}
