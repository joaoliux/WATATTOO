# Site do estúdio de tatuagem

Landing page em React + Vite + Framer Motion.

## Rodar local
```bash
npm install
npm run dev
```
Abra o endereço que aparecer (normalmente http://localhost:5173).

## O que editar
- `src/config.js`: nome, WhatsApp (só dígitos com 55 + DDD), endereço, horários, textos, trabalhos.
- Foto do banner: coloque `public/hero.jpg` e troque `heroImage` para `"/hero.jpg"` no config.
- Fotos dos trabalhos: coloque em `public/` e preencha `src` no config.
- Título da aba: `index.html`.

## Hospedar no Vercel
1. Suba a pasta para um repositório no GitHub.
2. Em vercel.com, clique em Add New > Project e importe o repositório.
3. O Vercel detecta o Vite sozinho (build: `npm run build`, saída: `dist`). Clique em Deploy.
4. Domínio: Project > Settings > Domains > Add, e siga os registros DNS que o Vercel mostrar.
