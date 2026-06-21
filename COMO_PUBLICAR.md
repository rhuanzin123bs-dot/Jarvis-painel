# Como colocar o JARVIS online (Vercel + GitHub)

Sem precisar instalar nada no computador — tudo pelo navegador.

## Passo 1 — Criar conta no GitHub
1. Acesse https://github.com/signup
2. Crie sua conta (e-mail, senha, nome de usuário)
3. Confirme o e-mail

## Passo 2 — Subir os arquivos do JARVIS
1. No GitHub, clique no **+** no canto superior direito → **New repository**
2. Nome do repositório: `jarvis-painel`
3. Deixe como **Public**, clique em **Create repository**
4. Na página do repositório, clique em **uploading an existing file**
5. Arraste TODOS os arquivos e pastas que estão dentro da pasta `jarvis-app` (mantendo a estrutura: `src/App.jsx`, `src/main.jsx`, `public/manifest.json`, `index.html`, `package.json`, `vite.config.js`)
6. Role para baixo, clique em **Commit changes**

## Passo 3 — Conectar ao Vercel
1. Acesse https://vercel.com/signup
2. Escolha **Continue with GitHub** (conecta direto com a conta que você acabou de criar)
3. Autorize o acesso quando pedir
4. No painel da Vercel, clique em **Add New** → **Project**
5. Selecione o repositório `jarvis-painel` na lista → **Import**
6. A Vercel já reconhece automaticamente que é um projeto Vite — não precisa mudar nada
7. Clique em **Deploy**
8. Aguarde 1-2 minutos

## Passo 4 — Pronto
A Vercel vai te dar um link tipo `jarvis-painel.vercel.app` — esse é o endereço do seu JARVIS, acessível de qualquer celular ou computador.

## Passo 5 — Instalar como app no celular (opcional, recomendado)
No Android, abra o link no Chrome → toque nos 3 pontinhos (⋮) → **Adicionar à tela inicial**. Isso faz o JARVIS se comportar mais como um app de verdade (tela cheia, ícone próprio) — importante para os botões de Controle Rápido funcionarem melhor.

## Atualizações futuras
Sempre que eu (Claude) editar o painel e te der um novo arquivo `App.jsx`, é só:
1. Ir no repositório no GitHub → entrar na pasta `src` → abrir `App.jsx`
2. Clicar no ícone de lápis (editar) → apagar tudo → colar o novo conteúdo
3. **Commit changes**
4. A Vercel atualiza o site sozinha em ~1 minuto, automaticamente
