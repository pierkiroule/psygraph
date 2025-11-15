# 🧠 Psychographie

**Psychographie** est une application React + Node.js permettant de générer des images et textes projectifs à visée thérapeutique, éducative ou créative.

> Conçue initialement pour un usage offline dans Termux (Android), elle est migrable et exécutable sur n'importe quel environnement Node (Linux, PC).

---

## 🔧 Installation

### Prérequis

- Node.js 18+
- npm
- Git

### Cloner le projet

```bash
git clone https://github.com/<TON_UTILISATEUR>/psygraph.git
cd psygraph
npm install
```

### Configuration Supabase

L’application embarque désormais une configuration Supabase de repli afin d’éviter l’erreur « Supabase déconnecté » lorsque aucun fichier `.env` n’est présent. Pour brancher votre propre instance :

1. Créez un fichier `.env` (ou `.env.local`) à la racine.
2. Définissez vos clés :

```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

3. (Optionnel) côté serveur, exportez également `SUPABASE_URL` et `SUPABASE_ANON_KEY` si vous utilisez les routes Node.

> Besoin de désactiver Supabase ? Définissez `VITE_SUPABASE_DISABLED=true` (et/ou `SUPABASE_DISABLED=true` côté serveur). L’application repassera en mode hors-ligne.
