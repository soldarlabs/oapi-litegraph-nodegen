export interface OapiOutputStatus {
  success: boolean;
  errorCode: number;
  recognizedOutputs: Record<string, any>;
  unrecognizedOutputs: Record<string, any>;
}

export interface OapiOutputProperties {
  status: OapiOutputStatus;
}
