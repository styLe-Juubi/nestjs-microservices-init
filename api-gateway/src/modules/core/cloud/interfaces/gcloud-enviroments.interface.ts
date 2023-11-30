import { IGCP_Config } from "./gcloud-config.interface";
import { IGCloud_Storage } from "./gcloud-storage.interface";

export interface IGCloud_Enviroments extends IGCP_Config {
    cloudStorage: IGCloud_Storage;
}