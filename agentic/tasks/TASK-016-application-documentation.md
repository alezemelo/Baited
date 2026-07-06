# TASK-016 — Documentazione composizione applicazione

- Stato: `in_progress`
- Dipendenze: TASK-015

## Obiettivo

Creare un hub documentale tecnico in inglese sotto `docs/` che descriva il comportamento attualmente implementato: architettura, bootstrap, stato frontend, catalogo blocchi, modello e validazione del grafo, API/persistenza, test ed estensione dell'applicazione.

## File coinvolti

- `docs/*.md`
- `README.md`
- `agentic/plans/workflow-editor-mvp.md`
- `agentic/AGENT-HANDOFF.md`

## Passi di implementazione

1. Creare un indice con ordine di lettura, confini e fonti di verità.
2. Documentare panoramica di sistema, bootstrap/runtime e gerarchia React con diagrammi Mermaid essenziali.
3. Documentare ownership dello stato, flussi dati, identità, dirty state e ripristino locale.
4. Inventariare una sola volta i nove template trascinabili e gli otto `kind`, includendo scopo, config, default, connessioni e prerequisiti.
5. Documentare modello del grafo, branch condition, operatori e regole di validazione.
6. Documentare contratto API, JSON Server, persistenza, errori e verifica con curl/Postman.
7. Documentare test, sviluppo, troubleshooting ed estensione sicura dell'app.
8. Collegare l'hub dal README root e verificare link, Mermaid e corrispondenza col codice.

## Criteri di accettazione

- `docs/` contiene soltanto i nove file Markdown concordati.
- La documentazione è in inglese, developer-first e non descrive funzionalità future come implementate.
- Ogni template del catalogo e ogni `kind` sono coperti esattamente una volta nell'inventario.
- Contratto API, porte, storage e comandi corrispondono al codice corrente.
- Tutti i link relativi risolvono a file esistenti.
- Il README root rimane quick start e collega il nuovo indice.

## Verifiche richieste

- `npm run build`
- `npm run lint`
- `git diff --check`
- Controllo automatico dei link Markdown locali
- Controllo inventario catalogo e soli file `.md` sotto `docs/`

## Note per l'handoff

Documentare struttura finale, verifiche eseguite ed eventuali eccezioni rispetto al piano approvato.
