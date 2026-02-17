function buildFormData(
    formData: FormData,
    data: object | string | number | boolean | null | undefined,
    parentKey?: string
): void {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
        Object.keys(data).forEach(key => {
            buildFormData(formData, (data as any)[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : String(data);
        if (parentKey) {
            formData.append(parentKey, value);
        }
    }
}

export function jsonToFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    buildFormData(formData, data);
    return formData;
}
