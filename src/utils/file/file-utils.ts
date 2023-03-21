export function exportText(str: string, fileName: string) {
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(str);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', fileName + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export async function importText(file: File) {
    return new Promise<string>((res, rej) => {
        var reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsText(file);
    });
}

export function exportJson(obj: any, fileName: string) {
    exportText(JSON.stringify(obj), fileName);
}

export async function importJson(file: File) {
    return importText(file).then(r => JSON.parse(r));
}
