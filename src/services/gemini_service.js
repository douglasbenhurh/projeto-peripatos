/**
 * Serviço de integração com Google Gemini API
 * Gera sugestões de texto baseadas em IA
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Gera descrição curta para uma obra baseada no título
 * @param {string} titulo - Título da obra
 * @returns {Promise<string>} - Descrição sugerida
 */
export async function suggestDescription(titulo) {
    if (!titulo) {
        throw new Error('Título é obrigatório para gerar sugestão');
    }

    const prompt = `Atue como um curador de museu especialista em história da arte e filosofia.
Escreva uma descrição curta, envolvente e poética (máximo 250 caracteres) para a obra "${titulo}".
Foque no aspecto filosófico ou histórico do artefato.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro da API Gemini (Status ' + response.status + '):', errorText);
            throw new Error(`Falha na API: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Erro ao sugerir descrição:', error);
        throw error;
    }
}

/**
 * Gera sugestão de localização para uma obra
 * @param {string} titulo - Título da obra
 * @returns {Promise<string>} - Localização sugerida
 */
export async function suggestLocation(titulo) {
    if (!titulo) {
        throw new Error('Título é obrigatório para gerar sugestão');
    }

    const prompt = `Identifique a localização real atual (Museu, Instituição ou Sítio Arqueológico) mais famosa onde se encontra a obra original "${titulo}".
Retorne APENAS o local e a cidade/país no formato: "Museu, Cidade". 
Exemplo: "Museu do Louvre, Paris" ou "Museu Britânico, Londres".
Seja preciso e conciso (máximo 50 caracteres). Sem ponto final.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro da API Gemini (Status ' + response.status + '):', errorText);
            throw new Error(`Falha na API: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Erro ao sugerir localização:', error);
        throw error;
    }
}

/**
 * Gera uma query de busca otimizada para o Unsplash (em inglês)
 * @param {string} titulo - Título da obra
 * @returns {Promise<string>} - Query otimizada (ex: "The Thinker Rodin sculpture")
 */
export async function generateImageSearchQuery(titulo) {
    if (!titulo) return '';

    const prompt = `Crie uma query de busca para o Unsplash para a obra "${titulo}".
    Regras:
    1. Traduza para INGLÊS.
    2. Formato: "Nome da Obra + Artista (se famoso) + Tipo (sculpture/painting)".
    3. NÃO adicione adjetivos como "art", "museum", "black and white", "famous".
    4. Seja o mais simples e direto possível.
    
    Exemplo bom: "The Thinker Rodin sculpture"
    Exemplo ruim: "The Thinker statue in a museum black and white art"`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            // Se der erro na IA, não quebra o fluxo, retorna o título original
            return titulo;
        }

        const data = await response.json();
        const suggestion = data.candidates[0].content.parts[0].text.trim();

        // Remove aspas se a IA colocar
        return suggestion.replace(/^["']|["']$/g, '');
    } catch (error) {
        console.error('Erro ao gerar query de imagem:', error);
        return titulo;
    }
}
