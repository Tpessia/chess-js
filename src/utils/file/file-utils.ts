export function exportJson(obj: any, fileName: string) {
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', fileName + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export async function importJson(file: File) {
    return new Promise<string>((res, rej) => {
        var reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsText(file);
    }).then(r => JSON.parse(r));
}
