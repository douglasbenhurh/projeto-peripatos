// Cloudinary Upload Service

/**
 * Upload de arquivo para Cloudinary
 * @param {File} file - Arquivo a ser enviado
 * @param {string} resourceType - Tipo: 'image' ou 'video' (para áudio também)
 * @returns {Promise<string>} URL do arquivo no Cloudinary
 */
export const uploadToCloudinary = async (file, resourceType = 'image') => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    console.log('🔵 Iniciando upload para Cloudinary:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        resourceType,
        cloudName,
        uploadPreset
    });

    if (!cloudName || !uploadPreset) {
        const error = 'Cloudinary não está configurado. Verifique as variáveis de ambiente.';
        console.error('❌', error);
        throw new Error(error);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', resourceType === 'image' ? 'peripatos/obras' : 'peripatos/audios');

    try {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        console.log('🔵 Enviando para:', url);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        console.log('🔵 Resposta recebida:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Erro na resposta do Cloudinary:', error);
            throw new Error(error.error?.message || 'Erro ao fazer upload');
        }

        const data = await response.json();
        console.log('✅ Upload bem-sucedido:', {
            url: data.secure_url,
            publicId: data.public_id,
            format: data.format
        });
        return data.secure_url; // URL HTTPS do arquivo
    } catch (error) {
        console.error('❌ Erro ao fazer upload para Cloudinary:', error);
        throw error;
    }
};
