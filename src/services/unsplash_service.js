/**
 * Serviço de integração com Unsplash API
 * Busca imagens de alta qualidade baseadas em query
 */

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

/**
 * Busca UMA imagem no Unsplash baseada em query e página
 * @param {string} query - Termo de busca (título da obra)
 * @param {number} page - Número da página (para buscar próxima imagem)
 * @returns {Promise<Object>} - Objeto com dados da imagem
 */
export async function searchImage(query, page = 1) {
    if (!query || query.trim().length === 0) {
        throw new Error('Query de busca é obrigatória');
    }

    if (!UNSPLASH_ACCESS_KEY) {
        throw new Error('API Key do Unsplash não configurada');
    }

    try {
        const searchQuery = encodeURIComponent(query);
        const response = await fetch(
            `${UNSPLASH_API_URL}/search/photos?query=${searchQuery}&per_page=1&page=${page}&orientation=landscape`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro da API Unsplash:', errorData);
            throw new Error('Falha ao buscar imagem');
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('Nenhuma imagem encontrada para esta busca');
        }

        const photo = data.results[0];

        return {
            id: photo.id,
            url: photo.urls.regular,
            thumbUrl: photo.urls.thumb,
            downloadUrl: photo.urls.full,
            description: photo.description || photo.alt_description || 'Imagem sem descrição',
            photographer: {
                name: photo.user.name,
                username: photo.user.username,
                link: photo.user.links.html
            },
            downloadLink: photo.links.download_location // Para tracking de download
        };
    } catch (error) {
        console.error('Erro ao buscar imagem:', error);
        throw new Error(error.message || 'Não foi possível buscar imagem. Verifique sua conexão e tente novamente.');
    }
}

/**
 * Registra download de imagem (requisito da API Unsplash)
 * @param {string} downloadLink - Link de tracking do download
 */
export async function trackDownload(downloadLink) {
    if (!downloadLink || !UNSPLASH_ACCESS_KEY) {
        return;
    }

    try {
        await fetch(downloadLink, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            }
        });
    } catch (error) {
        console.warn('Erro ao registrar download:', error);
        // Não bloqueia o fluxo se o tracking falhar
    }
}

/**
 * Converte URL da imagem em File object para compatibilidade com o upload
 * @param {string} imageUrl - URL da imagem
 * @param {string} filename - Nome do arquivo
 * @returns {Promise<File>} - File object
 */
export async function urlToFile(imageUrl, filename = 'unsplash-image.jpg') {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        console.error('Erro ao converter URL em File:', error);
        throw new Error('Não foi possível processar a imagem');
    }
}
