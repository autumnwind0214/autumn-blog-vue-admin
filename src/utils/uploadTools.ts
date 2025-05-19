import SparkMD5 from "spark-md5";
import {
  checkChunk,
  checkFile,
  mergeChunks,
  uploadChunk
} from "@/api/modules/media/upload";

export const uploadByPieces = ({ file, pieceSize = 5, error }: any) => {
  // 上传过程中用到的变量
  let fileMD5 = ""; // md5加密文件的标识
  const chunkSize = pieceSize * 1024 * 1024; // 分片大小
  const chunkCount = Math.ceil(file.size / chunkSize); // 总片数

  //得到某一片的分片
  const getChunkInfo = (file, currentChunk, chunkSize) => {
    const start = currentChunk * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    return file.raw.slice(start, end);
  };

  // 第一步
  const readFileMD5 = () => {
    //得到第一片和最后一片
    // const startChunk = getChunkInfo(file, 0, chunkSize);
    // const endChunk = getChunkInfo(file, chunkCount - 1, chunkSize);
    //对第一片进行转码然后md5加密，网上很多是直接对整个文件转码加密得到标识，但是我发现大文件尤其是几个G的文件会崩溃，所以我是先分片然后取第一片加密
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      if (e.target && e.target.result instanceof ArrayBuffer) {
        // 使用 spark-md5 库从 ArrayBuffer 计算 MD5
        // let fileBolb = (e.target as any).result;
        fileMD5 = SparkMD5.ArrayBuffer.hash(e.target.result);
        // 上传前提交注册 - 参数
        const params = {
          fileMd5: fileMD5
          // fileName:file.name,
          // fileSize:file.size,
          // mimetype:file.raw.type,
          // fileExt:file.name.split('.').at(-1)
        };
        // 上传前提交注册 - 接口调用
        checkFile(params)
          .then(() => {})
          .catch(err => error(err));
      } else {
        console.error("Failed to read file as ArrayBuffer");
      }
    };

    fileReader.onerror = function () {
      console.error("File reading failed");
    };

    // 开始读取文件为 ArrayBuffer
    fileReader.readAsArrayBuffer(file.raw);
  };

  // 针对每个分片文件进行上传处理
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const readChunkMD5 = async num => {
    if (num <= chunkCount - 1) {
      //得到当前需要上传的分片文件
      const chunk = getChunkInfo(file, num, chunkSize);
      // 上传分块前检查
      //await checkchunk({fileMd5:fileMD5,chunk:num,chunkSize:chunkCount}).then( async res => {
      await checkChunk({ fileMd5: fileMD5, chunk: num }).then(async res => {
        if (res) {
          // 分块上传
          const fetchForm = new FormData();
          fetchForm.append("file", chunk);
          fetchForm.append("fileMd5", fileMD5);
          fetchForm.append("chunk", num);
          await uploadChunk(fetchForm).then(async () => {
            // 上传成功
            readChunkMD5(num + 1);
          });
        } else {
          // success({num, chunkCount, state: 'uploading'})
          readChunkMD5(num + 1);
        }
      });
    } else {
      // 上传结束请求合并
      // 提交合并
      mergeChunks({
        fileMd5: fileMD5,
        fileName: file.name,
        chunkTotal: chunkCount
      }).then(res => {
        // 合并成功了
        if (res) {
          console.log("合并成功");
        }
      });
    }
  };

  readFileMD5(); // 开始执行代码
};
