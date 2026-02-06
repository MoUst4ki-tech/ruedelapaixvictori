# Comment Contribuer au Projet

Bienvenue sur le projet ! Voici un guide pour vous aider à ajouter de nouvelles fonctionnalités et créer des mini-jeux.

## 1. Ajouter un Composant React

Pour créer un nouveau composant React (par exemple pour l'interface utilisateur ou un wrapper de jeu) :

1.  Allez dans le dossier `jam-game/src/components`.
2.  Créez un nouveau fichier `.tsx`, par exemple `MonComposant.tsx`.
3.  Utilisez la structure de base suivante :

```tsx
'use client';

import React from 'react';

const MonComposant = () => {
    return (
        <div className="p-4 bg-gray-800 text-white rounded">
            <h2>Mon Nouveau Composant</h2>
            <p>Ceci est un composant React simple.</p>
        </div>
    );
};

export default MonComposant;
```

## 2. Intégrer le Composant

Pour utiliser votre nouveau composant dans une page (par exemple la page d'accueil) :

1.  Ouvrez `jam-game/src/app/page.tsx` (ou une autre page).
2.  Importez votre composant :

```tsx
import MonComposant from '@/components/MonComposant';
```

3.  Ajoutez-le dans le JSX retourné :

```tsx
export default function Home() {
  return (
    <main className="...">
      <h1>Titre du Jeu</h1>
      <MonComposant />
      {/* ... autres composants ... */}
    </main>
  );
}
```

## 3. Créer un Jeu avec Phaser

Nous utilisons Phaser 3 intégré dans React. Voici comment créer un nouveau mini-jeu.

### Étape A : Créer le Composant du Jeu

Créez un fichier `MonMiniJeu.tsx` dans `src/components/`, en vous basant sur l'exemple existant `Game.tsx`.

Il est **CRUCIAL** d'initialiser Phaser uniquement côté client (dans un `useEffect`) et de nettoyer l'instance quand le composant est démonté.

Structure recommandée :

```tsx
'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

const MonMiniJeu = () => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && gameContainer.current && !gameRef.current) {
            // Configuration Phaser
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent: gameContainer.current,
                physics: {
                    default: 'arcade',
                    arcade: { gravity: { y: 0 } }
                },
                scene: {
                    preload: preload,
                    create: create,
                    update: update
                }
            };

            gameRef.current = new Phaser.Game(config);
        }

        return () => {
            // Nettoyage impératif
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    // --- Fonctions Phaser ---

    function preload(this: Phaser.Scene) {
        // Charger les assets (images, sons)
        // this.load.image('balle', '/assets/balle.png');
    }

    function create(this: Phaser.Scene) {
        // Initialiser la scène
        this.add.text(400, 300, 'Mon Super Jeu', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }

    function update(this: Phaser.Scene) {
        // Boucle de jeu (60fps)
    }

    return (
        <div ref={gameContainer} id="game-container" />
    );
};

export default MonMiniJeu;
```

### Étape B : Intégration Dynamique

Comme Phaser utilise l'objet `window`, il ne peut pas être rendu côté serveur (SSR). Vous devez l'importer dynamiquement avec `ssr: false` dans Next.js.

Dans votre page (`page.tsx`) :

```tsx
'use client';

import dynamic from 'next/dynamic';

// Import dynamique sans SSR
const MonMiniJeu = dynamic(() => import('@/components/MonMiniJeu'), { ssr: false });

export default function PageJeu() {
  return (
    <main>
       <MonMiniJeu />
    </main>
  );
}
```

### Conseils

*   **Assets** : Mettez vos images dans le dossier `public/` de Next.js. Dans Phaser, chargez-les avec `this.load.image('key', '/mon-image.png')`.
*   **Logique** : Gardez la logique du jeu (mouvements, scores) à l'intérieur des fonctions `create` et `update` de Phaser.
*   **React vs Phaser** : Utilisez React pour l'UI autour du jeu (menus, scores globaux) et Phaser pour le canvas du jeu lui-même.
