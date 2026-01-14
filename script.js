const USE_MOCK_DATA = true; // 'false' quando backend estiver pronto
const API_BASE_URL = 'https://how-did-you-do-it-api.onrender.com/api';

const app = document.getElementById('app-content');
const showdownConverter = new showdown.Converter();

// --- FUNÇÕES DE RENDERIZAÇÃO ---

function renderHomePage(projetos) {
    const title = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Projetos da Comunidade</h1>
            <p class="mt-2 text-lg text-gray-600">Descubra, aprenda e se inspire com o que os outros estão criando.</p>
        </div>
    `;
    const projectList = projetos.map(p => {
        const autorNome = p.user ? p.user.nomeExibicao : 'Usuário Desconhecido';
        const autorUsername = p.user ? p.user.username : '#';
        const autorFoto = p.user ? p.user.fotoPerfil : 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=?';

        return `
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div class="p-6">
                ${p.origemProjetoId ? `<p class="text-sm text-gray-500 mb-2">Reinterpretação de um projeto.</p>` : ''}
                <h2 class="text-xl font-bold text-gray-900 mb-2">${p.titulo}</h2>
                <p class="text-gray-600 mb-4 h-12 overflow-hidden text-ellipsis">${p.descricaoCurta}</p>
                <div class="flex items-center justify-between">
                    <a href="#/perfil/${autorUsername}" class="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                        <img src="${autorFoto}" alt="Avatar de ${autorNome}" class="w-8 h-8 rounded-full">
                        <span>${autorNome}</span>
                    </a>
                    <div class="flex items-center space-x-4 text-sm">
                        <span class="flex items-center text-gray-500">
                            <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                            ${p.salvamentos}
                        </span>
                    </div>
                </div>
            </div>
             <a href="#/projeto/${p.id}" class="block bg-gray-50 text-center text-blue-600 font-semibold py-3 hover:bg-gray-100 transition">Ver Projeto</a>
        </div>
    `}).join('');
    
    return `${title}<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${projectList}</div>`;
}

function renderProjectPage(projeto) {
    if (!projeto || !projeto.user) return renderError("Projeto não encontrado ou incompleto.");

    const autor = projeto.user;
    // Fallback para história vazia se necessário
    const historiaPlaceholder = `
## Sobre o Projeto

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Materiais Necessários

- Item 1: Lorem ipsum dolor
- Item 2: Consectetur adipiscing
- Item 3: Sed do eiusmod tempor

### Passo a Passo

1. **Planejamento**: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
2. **Execução**: Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
3. **Finalização**: Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

> "A criatividade é a inteligência se divertindo." - Albert Einstein
    `;
    const historiaHtml = showdownConverter.makeHtml(projeto.historia || historiaPlaceholder);
    
    return `
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
            ${projeto.origemProjetoId ? `<div class="mb-4 text-gray-600 bg-gray-100 p-3 rounded-md">Reinterpretação de outro projeto</div>` : ''}
            <h1 class="text-3xl font-bold text-gray-900 mb-2">${projeto.titulo}</h1>
            <p class="text-lg text-gray-600 mb-4">${projeto.descricaoCurta}</p>
            
            <div class="flex items-center justify-between border-t border-b border-gray-200 py-4 my-4">
                <a href="#/perfil/${autor.username}" class="flex items-center space-x-3">
                    <img src="${autor.fotoPerfil}" class="w-12 h-12 rounded-full">
                    <div>
                        <p class="font-bold text-gray-800">${autor.nomeExibicao}</p>
                        <p class="text-sm text-gray-500">@${autor.username}</p>
                    </div>
                </a>
                <div class="flex items-center space-x-4">
                    <button class="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md transition">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                        <span>Salvar</span>
                        <span class="bg-gray-300 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">${projeto.salvamentos}</span>
                    </button>
                    <button class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center space-x-2">
                         <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>
                        <span>Reinterpretar</span>
                    </button>
                </div>
            </div>
            <div class="markdown-content mt-6 prose prose-blue max-w-none">
                ${historiaHtml}
            </div>
        </div>
    `;
}

function renderProfilePage(usuario, projetos) {
    if (!usuario || Array.isArray(usuario) && usuario.length === 0) return renderError("Usuário não encontrado.");

    const projetosOriginais = projetos.filter(p => !p.origemProjetoId);
    const reinterpretacoes = projetos.filter(p => p.origemProjetoId);
    
    const projectGrid = (projs) => {
        if (projs.length === 0) return `<p class="text-gray-500 mt-4">Nenhum projeto encontrado.</p>`;
        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">${projs.map(p => `
             <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                 <a href="#/projeto/${p.id}" class="text-lg font-bold text-blue-600 hover:underline">${p.titulo}</a>
                 <p class="text-sm text-gray-600 mt-1 h-10 overflow-hidden text-ellipsis">${p.descricaoCurta}</p>
             </div>
        `).join('')}</div>`;
    };

    return `
        <div class="flex flex-col md:flex-row items-start gap-8">
            <div class="w-full md:w-1/4 text-center">
                <img src="${usuario.fotoPerfil}" class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover">
                <h1 class="text-3xl font-bold">${usuario.nomeExibicao}</h1>
                <p class="text-gray-500 mb-2">@${usuario.username}</p>
                <p class="text-gray-700">${usuario.bio || "Sem biografia."}</p>
            </div>
            <div class="w-full md:w-3/4">
                <div>
                    <h2 class="text-2xl font-bold border-b-2 border-blue-600 pb-2">Projetos Originais (${projetosOriginais.length})</h2>
                    ${projectGrid(projetosOriginais)}
                </div>
                <div class="mt-8">
                    <h2 class="text-2xl font-bold border-b border-gray-200 pb-2">Reinterpretações (${reinterpretacoes.length})</h2>
                    ${projectGrid(reinterpretacoes)}
                </div>
            </div>
        </div>
    `;
}

function renderCreatePage() {
    return `
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Crie um Novo Projeto</h1>
            <p class="text-gray-600">Funcionalidade a ser implementada, conectando este formulário ao endpoint POST da API.</p>
        </div>
    `;
}

function renderLoading() {
    return `<div class="text-center py-20"><p class="text-gray-500">Carregando...</p></div>`;
}

function renderError(message) {
     return `<div class="text-center py-20">
        <h1 class="text-2xl font-bold text-red-600">Ocorreu um Erro</h1>
        <p class="text-gray-600 mt-4">${message}</p>
        <a href="#/" class="mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition">Voltar ao Início</a>
        </div>`;
}

// mockData.js
const MOCK_DATA = {
    '/projects': [
        {
            id: 1,
            titulo: "Horta Vertical com Garrafas PET",
            descricaoCurta: "Uma solução sustentável e barata para cultivar temperos em apartamentos.",
            salvamentos: 23,
            user: {
                username: "beto.construtor",
                nomeExibicao: "Beto Construtor",
                fotoPerfil: "https://ui-avatars.com/api/?name=Beto+Construtor&background=0D8ABC&color=fff"
            },
            historia: `
## A Ideia

Sempre quis ter uma horta, mas morando em apartamento o espaço é limitado. Olhando para algumas garrafas PET que iriam para o lixo, tive uma ideia.

### Materiais

- 5 Garrafas PET de 2L
- Tesoura e fio de arame
- Terra adubada
- Sementes de manjericão, salsa e cebolinha

### Como Fiz

1. **Preparação das Garrafas**: Lavei bem e fiz cortes retangulares na lateral.
2. **Sistema de Drenagem**: Fiz furos na tampa e no fundo para a água escorrer de uma para outra.
3. **Montagem**: Prendi as garrafas umas às outras com arame, formando uma "coluna".
4. **Plantio**: Coloquei a terra e as sementes.

O resultado foi incrível e em 3 semanas já tinha brotos!
            `
        },
        {
            id: 2,
            titulo: "Portfólio Pessoal com React",
            descricaoCurta: "Guia passo a passo para construir um site moderno.",
            salvamentos: 128,
            user: {
                username: "ana.dev",
                nomeExibicao: "Ana Dev",
                bio: "Desenvolvedora Frontend apaixonada por UI/UX.",
                fotoPerfil: "https://ui-avatars.com/api/?name=Ana+Dev&background=random"
            },
            historia: `
## Construindo meu Espaço na Web

Como dev, ter um portfólio é essencial. Decidi usar React para mostrar minhas habilidades.

### Tech Stack

- **React**: Biblioteca principal
- **Tailwind CSS**: Para estilização rápida
- **Framer Motion**: Animações

### Etapas do Desenvolvimento

1. **Design no Figma**: Criei o layout antes de codar.
2. **Estrutura de Componentes**: Header, Hero, Projects, Contact.
3. **Responsividade**: Garantindo que funcione no celular.

Agora consigo mostrar meus trabalhos de forma profissional!
            `
        }
    ]
};

// --- ROTEADOR e LÓGICA DE DADOS ---

async function apiFetch(endpoint) {
    if (USE_MOCK_DATA) {
        console.log(`[MOCK MODE] Buscando dados para: ${endpoint}`);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Rota: /projects
        if (endpoint === '/projects') {
            return MOCK_DATA['/projects'];
        }

        // Rota: /projects/:id (Ex: /projects/1)
        const projectMatch = endpoint.match(/^\/projects\/(\d+)$/);
        if (projectMatch) {
            const id = parseInt(projectMatch[1]);
            const projeto = MOCK_DATA['/projects'].find(p => p.id === id);
            return projeto || null;
        }

        // Rota: /users/:username
        const userMatch = endpoint.match(/^\/users\/(.+)$/);
        if (userMatch) {
            const username = userMatch[1];
            // Procura o usuário dentro dos projetos (simulação de "banco de dados" relacional flat)
            const projetoComAutor = MOCK_DATA['/projects'].find(p => p.user.username === username);
            return projetoComAutor ? projetoComAutor.user : null;
        }

        // Rota: /projects/author/:username
        const authorProjectsMatch = endpoint.match(/^\/projects\/author\/(.+)$/);
        if (authorProjectsMatch) {
            const username = authorProjectsMatch[1];
            return MOCK_DATA['/projects'].filter(p => p.user.username === username);
        }

        // Default: tenta pegar direto do objeto MOCK_DATA (para casos estáticos futuros)
        return MOCK_DATA[endpoint] || null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao buscar dados da API:", error);
         console.warn("API offline. Usando dados de backup.");
        app.innerHTML = renderError(error.message);
        throw error; 
    }
}

async function router() {
    const path = location.hash.slice(1) || '/';
    app.innerHTML = renderLoading();

    app.classList.remove('fade-in');
    app.classList.add('fade-out');
    
    let newContent = '';

    try {
        if (path === '/') {
            const projects = await apiFetch('/projects');
            newContent = renderHomePage(projects || []);
        } else if (path.startsWith('/projeto/')) {
            const id = path.split('/')[2];
            const project = await apiFetch(`/projects/${id}`);
            if (project) {
                newContent = renderProjectPage(project);
            } else {
                 newContent = renderError("Projeto não encontrado.");
            }
        } else if (path.startsWith('/perfil/')) {
            const username = path.split('/')[2];
            try {
                const [user, projects] = await Promise.all([
                    apiFetch(`/users/${username}`),
                    apiFetch(`/projects/author/${username}`)
                ]);
                newContent = renderProfilePage(user, projects || []);
            } catch (err) {
                 newContent = renderError("Não foi possível carregar o perfil.");
            }
        } else if (path === '/criar') {
            newContent = renderCreatePage();
        } else {
             newContent = renderError("Página não encontrada.");
        }
    } catch (e) {
        console.error("Erro no roteador:", e);
        if (!app.querySelector('.text-red-600')) {
             newContent = renderError("Algo deu errado ao carregar a página.");
        }
    }

    setTimeout(() => {
        app.innerHTML = newContent;
        app.classList.remove('fade-out');
        app.classList.add('fade-in');
        window.scrollTo(0, 0);
    }, 300);
}

// --- INICIALIZAÇÃO ---
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
