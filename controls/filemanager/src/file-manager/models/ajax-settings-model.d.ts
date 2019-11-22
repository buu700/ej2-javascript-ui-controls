import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class AjaxSettings
 */
export interface AjaxSettingsModel {

    /**
     * Specifies URL to download the files from server.
     * @default null
     */
    downloadUrl?: string | ((path: string, items: {data: Object; name: string}[]) => Promise<void>);

    /**
     * Specifies URL to get the images from server.
     * @default null
     */
    getImageUrl?: string | ((path: string, imgId?: string) => Promise<string>);

    /**
     * Specifies URL to upload the files to server.
     * @default null
     */
    uploadUrl?: string | {
        remove: (data: string | Object) => Promise<void>;
        save: (data: string | Object) => Promise<void>;
    };

    /**
     * Specifies URL to read the files from server.
     * @default null
     */
    url?: string | ((data: string | Object) => Promise<void>);

}