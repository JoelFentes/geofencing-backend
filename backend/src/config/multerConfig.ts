// src/config/multerConfig.ts
import multer from 'multer';

// 1. Configuração de Storage: Usamos 'memoryStorage' para armazenar o arquivo 
//    na memória RAM temporariamente. Isso é bom se você for enviar o arquivo 
//    imediatamente para um serviço externo (como S3, Cloudinary).
const storage = multer.memoryStorage();

// 2. Criação do Middleware Multer
// 'single("photo")' significa que o campo de upload no FormData é chamado "photo"
export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite o tamanho do arquivo em 5MB
});