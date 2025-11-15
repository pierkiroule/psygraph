#!/bin/bash
echo "🔍 Recherche de traces de l'ancienne appli Psychographie..."

# 1. Rechercher par nom de dossier ou fichier
echo "➡ Scan des noms de fichiers/dossiers..."
find ~ /sdcard -type d -name "*psygraph*" 2>/dev/null
find ~ /sdcard -type f -name "*psygraph*" 2>/dev/null

# 2. Rechercher dans le contenu (au cas où le nom a changé)
echo "➡ Scan du contenu (cela peut prendre du temps)..."
grep -R "Psychographie" ~ /sdcard 2>/dev/null | head -n 20

# 3. Vérifier s’il existe un dépôt Git (qui contiendrait les anciens commits)
echo "➡ Vérification de la présence d'un dépôt Git..."
find ~ /sdcard -type d -name ".git" 2>/dev/null

# 4. Chercher d’éventuelles sauvegardes d’Acode ou fichiers récents
echo "➡ Fichiers modifiés récemment dans ~/ ou /sdcard (dernières 48h)..."
find ~ /sdcard -type f -mtime -2 2>/dev/null | grep -i "psy"

echo "🔎 Scan terminé. Si tu vois des chemins, on peut tenter de récupérer."
