
function buildFormData(formData : FormData, data: any, parentKey: string | undefined) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
        Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;
        if(parentKey){
            formData.append(parentKey, value);
        }
    }
}

export function jsonToFormData(data: object) {
    const formData = new FormData();

    buildFormData(formData, data, undefined);

    return formData;
}