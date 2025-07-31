#!/bin/bash
cd ~/react/psygraph || exit

# Charger les variables d'environnement
set -a
source .env
set +a

# Vérifier la clé
if [ -z "$NEBIUS_API_KEY" ]; then
  echo "❌ NEBIUS_API_KEY manquante dans .env"
  exit 1
fi
export OPENAI_API_KEY="$NEBIUS_API_KEY"
echo "🔑 Clé Nebius détectée (${NEBIUS_API_KEY:0:8}...)"

# Tuer les processus existants
pkill -f "node server.js" && echo "♻️ Backend précédent stoppé"
pkill -f "vite" && echo "♻️ Frontend précédent stoppé"

# Lancer backend
echo "🚀 Lancement du backend (server.js) sur le port 3001..."
node server.js &

# Lancer frontend
echo "🎨 Lancement du frontend (Vite) sur le port 3000..."
npm run dev -- --host &

# Attente courte
sleep 2

# Détection IP locale
IP=$(getprop dhcp.wlan0.ipaddress 2>/dev/null | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}')
if [ -z "$IP" ]; then
  IP="192.168.1.21"
  echo "⚠️ IP locale non détectée automatiquement. IP par défaut utilisée : $IP"
else
  echo "🌐 IP locale détectée : $IP"
fi

# Résumé final
echo "✅ Tout est lancé. Backend : http://localhost:3001 | Frontend : http://$IP:3000"