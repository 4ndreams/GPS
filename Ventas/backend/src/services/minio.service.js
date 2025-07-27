import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: '146.83.198.35',
  port: 1411,
  useSSL: false,
  accessKey: 'atapia',
  secretKey: 'andrea2025',
});

export default minioClient;
