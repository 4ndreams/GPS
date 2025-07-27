import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: '146.83.198.35',
  port: 1411,
  useSSL: false,
  accessKey: 'atapia',
  secretKey: 'andrea2025'
})



// Destination bucket
const bucket = 'mundopuertas'

// File to upload
const sourceFile = '/home/maraya/GPS/Ventas/backend/minions.tsx'

// Destination object name
const destinationObject = 'minions.txt'


// Check if the bucket exists
// If it doesn't, create it
const exists = await minioClient.bucketExists(bucket)
if (exists) {
  console.log('Bucket ' + bucket + ' exists.')
} else {
  await minioClient.makeBucket(bucket, 'us-east-1')
  console.log('Bucket ' + bucket + ' created in "us-east-1".')
}

// Set the object metadata
var metaData = {
  'Content-Type': 'text/plain',
  'X-Amz-Meta-Testing': 1234,
  example: 5678,
}

// Upload the file with fPutObject
// If an object with the same name exists,
// it is updated with new data
await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)
console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)
