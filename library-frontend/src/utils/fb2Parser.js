export const parseFB2Clean = (xmlText) => {
    try {
        const bodyStart = xmlText.indexOf('<body>');
        const bodyEnd = xmlText.lastIndexOf('</body>');
        
        if (bodyStart === -1 || bodyEnd === -1) {
            throw new Error('Не найден тег body');
        }
        
        let text = xmlText.substring(bodyStart + 6, bodyEnd);
        
        const divEnd = text.indexOf('</div>');
        if (divEnd !== -1) {
            text = text.substring(divEnd + 6);
        }
        
        text = parseSections(text);
        
        text = cleanText(text);
        
        return {
            text: text,
            isFB2: true,
            textLength: text.length
        };
        
    } catch (error) {
        console.error("Ошибка в parseFB2Clean:", error);
        const fallback = xmlText.replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, 5000);
        return {
            text: fallback,
            isFB2: false,
            error: true
        };
    }
};

/**
 * Парсинг секций
 */
function parseSections(text) {
    let result = '';
    
    const sectionRegex = /<section[^>]*>([\s\S]*?)<\/section>/gi;
    let match;
    let sectionIndex = 0;
    
    while ((match = sectionRegex.exec(text)) !== null) {
        const sectionContent = match[1];
        result += parseSectionContent(sectionContent, sectionIndex);
        sectionIndex++;
    }
    
    if (!result) {
        result = parseDirectContent(text);
    }
    
    return result;
}

/**
 * Парсинг содержимого секции
 */
function parseSectionContent(content, index) {
    let sectionText = '';
    
    const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
        const title = parseTitle(titleMatch[1]);
        if (title.trim()) {
            if (index === 0) {
                sectionText += `\n\n# ${title.trim()}\n\n`;
            } else {
                sectionText += `\n\n## ${title.trim()}\n\n`;
            }
        }
        content = content.replace(titleMatch[0], '');
    }
    
    content = content.replace(/<epigraph[^>]*>([\s\S]*?)<\/epigraph>/gi, '');
    
    const poemMatch = content.match(/<poem[^>]*>([\s\S]*?)<\/poem>/i);
    if (poemMatch) {
        const poem = parsePoem(poemMatch[1]);
        sectionText += poem + '\n\n';
        content = content.replace(poemMatch[0], '');
    }
    
    if (content.trim()) {
        sectionText += parseText(content);
    }
    
    return sectionText;
}

/**
 * Парсинг стихов
 */
function parsePoem(poemContent) {
    let poemText = '';
    
    const stanzaRegex = /<stanza[^>]*>([\s\S]*?)<\/stanza>/gi;
    let stanzaMatch;
    
    while ((stanzaMatch = stanzaRegex.exec(poemContent)) !== null) {
        const stanza = stanzaMatch[1];
        const lines = stanza.split(/<\/v>\s*<v[^>]*>/);
        
        lines.forEach(line => {
            line = line.replace(/<v[^>]*>|<\/v>/g, '')
                .replace(/<[^>]*>/g, ' ')
                .trim();
            
            if (line) {
                poemText += '    ' + line + '\n';
            }
        });
        
        poemText += '\n';
    }
    
    return poemText;
}


function parseText(content) {

    content = content.replace(/<p[^>]*>/gi, '\n    ');
    content = content.replace(/<\/p>/gi, '');
    
    content = content.replace(/<empty-line[^>]*\/?>/gi, '\n\n');
    
    content = content.replace(/<a[^>]*>[\s\S]*?<\/a>/gi, '');
    
    content = content.replace(/<[^>]*>/g, ' ');
    
    content = decodeEntities(content);
    
    let lines = content.split('\n');
    let result = '';
    
    for (let line of lines) {
        line = line.replace(/\s+/g, ' ').trim();
        if (line) {
            result += line + '\n';
        } else {
            result += '\n';
        }
    }
    
    result = result.replace(/\n{3,}/g, '\n\n');
    
    return result;
}

/**
 * Парсинг заголовка
 */
function parseTitle(titleContent) {
    let title = titleContent
        .replace(/<p[^>]*>/gi, ' ')
        .replace(/<\/p>/gi, ' ')
        .replace(/<emphasis[^>]*>/gi, '')
        .replace(/<\/emphasis>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    return decodeEntities(title);
}

/**
 * Прямой парсинг (без секций)
 */
function parseDirectContent(text) {
    let result = text;

    const bookTitle = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (bookTitle) {
        const title = parseTitle(bookTitle[1]);
        if (title.trim()) {
            result = '# ' + title.trim() + '\n\n';
        }
        text = text.replace(bookTitle[0], '');
    }
    
    result += parseText(text);
    
    return result;
}

/**
 * Декодирует HTML entities
 */
function decodeEntities(text) {
    return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&nbsp;/g, ' ')
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–');
}

/**
 * Финальная очистка текста
 */
function cleanText(text) {
    return text
        .replace(/^[ ]{4}/gm, '    ')
        .replace(/^[ \t]+/gm, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n\s*\n\s*\n+/g, '\n\n')
        .replace(/^    /gm, '    ')
        .trim();
}

// простая версия
export const parseFB2Simple = (xmlText) => {
    try {
        const bodyMatch = xmlText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (!bodyMatch) return { text: 'Не найден текст книги', isFB2: false };
        
        let text = bodyMatch[1];
        
        text = text.replace(/<div[^>]*>[\s\S]*?<\/div>/i, '');
        
        text = text
            .replace(/<a[^>]*>[\s\S]*?<\/a>/gi, '')
            .replace(/<title[^>]*>\s*<p>([^<]+)<\/p>\s*<\/title>/gi, '\n\n## $1 ##\n\n')
            .replace(/<p[^>]*>/gi, '\n    ')
            .replace(/<\/p>/gi, '')
            .replace(/<empty-line[^>]*\/?>/gi, '\n\n')
            .replace(/<v[^>]*>([^<]+)<\/v>/gi, '    $1\n')
            .replace(/<[^>]*>/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
        
        text = text
            .replace(/\s+/g, ' ')
            .replace(/^[ ]{4}/gm, '    ')
            .replace(/^[ \t]+/gm, '')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n\s*\n\s*\n+/g, '\n\n')
            .replace(/^    /gm, '    ')
            .trim();
        
        return {
            text: text,
            isFB2: true,
            textLength: text.length
        };
        
    } catch (error) {
        console.error("Ошибка в parseFB2Simple:", error);
        return {
            text: xmlText.substring(0, 1000).replace(/<[^>]*>/g, ' '),
            isFB2: false,
            error: true
        };
    }
};

