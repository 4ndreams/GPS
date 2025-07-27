import { Router } from 'express';
import minioClient from '../services/minio.service.js';

const router = Router();

// Endpoint para obtener presigned URL para subida
router.get('/upload-url', async (req, res) => {
  const { filename } = req.query;
  const bucketName = 'mundopuertas';
  const expiresInSeconds = 600;

  try {
    const url = await minioClient.presignedPutObject(bucketName, filename, expiresInSeconds);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Puedes agregar más endpoints aquí según lo que necesites

export default router;
