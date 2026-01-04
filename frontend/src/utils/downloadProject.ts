import JSZip from 'jszip';
import { GeneratedFiles } from '../generators/CodeGenerator';

export async function downloadProject(files: GeneratedFiles, projectName: string = 'deepblocks-project') {
    const zip = new JSZip();

    // 添加所有文件
    Object.entries(files).forEach(([filename, content]) => {
        zip.file(filename, content);
    });

    // 生成 ZIP blob
    const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
    });

    // 觸發下載
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
