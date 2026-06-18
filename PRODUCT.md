# Impresa Viva — Product

## Posizionamento

Impresa Viva è un gestionale semplice per piccoli business italiani: negozi, palestre, centri estetici, bar, ristoranti, meccanici, attività a gestione familiare.

Tagline: "Gestionale semplice per piccoli business italiani".

Sostituisce quaderni, fogli Excel, gruppi WhatsApp e promemoria sparsi con un unico posto semplice da usare, pensato per chi non è esperto di tecnologia. È un prodotto reale e vendibile, non una demo.

## Utenti target

- Titolari di piccole attività italiane, spesso senza personale IT o amministrativo dedicato.
- Utenti non tecnici: l'app deve essere comprensibile senza formazione né manuale.
- Attività con un numero limitato di clienti/dipendenti — non enterprise, non multinazionali.
- Attività con più collaboratori o più sedi della stessa azienda (richiede struttura multi-azienda, vedi `ARCHITECTURE.md`).

## Regole di linguaggio e tono

- Tutto il testo visibile è in italiano.
- Vocabolario semplice e concreto: clienti, pagamenti, promemoria, scadenze, messaggi, abbonamenti, incassi, fornitori, magazzino.
- Niente gergo tecnico nell'interfaccia: evitare parole come CRM, workflow, automazione, agente, pipeline, billing lifecycle, integrazione.
- Mai usare la parola "AI" nell'interfaccia, e nessun riferimento a Claude/Anthropic o a strumenti di sviluppo.
- Design minimale, calmo, professionale: pulsanti grandi, card chiare, tabelle semplici, nessuna dashboard complicata.

## Funzionalità principali (UI esistente, da collegare a dati reali)

Organizzate in 4 aree:

- **Da fare oggi**: Oggi, Promemoria, Messaggi, Riepilogo settimana
- **Clienti e vendite**: Clienti, Abbonamenti, Promozioni, Recensioni
- **Soldi e scadenze**: Pagamenti, IVA e incassi, Commercialista, Stipendi
- **Gestione attività**: Preventivi, Fornitori, Magazzino, Scadenze attività

Comportamento atteso a regime (non ancora implementato — oggi è tutto dato finto):

- Dati reali e separati per ogni azienda (multi-tenant), nessun dato condiviso tra clienti diversi del prodotto.
- Nessun invio automatico di messaggi: ogni comunicazione richiede conferma esplicita dell'utente.
- Le sezioni IVA e Commercialista restano strumenti organizzativi indicativi: non sostituiscono un commercialista vero e non fanno calcoli fiscali ufficiali.

## Non-goal (per ora)

- Non è un CRM enterprise, non è un ERP completo.
- Nessuna automazione invisibile: l'utente resta sempre in controllo di cosa viene inviato o registrato.
- Nessun calcolo fiscale, contributivo o di payroll reale.
- Nessuna integrazione con servizi esterni reali finché non richiesto esplicitamente.
- Nessuna funzione "AI"-branded nell'interfaccia.
- Pagamenti reali, fatturazione elettronica, firma digitale: fuori scope finché non richiesti esplicitamente.

## Fasi successive (esplicitamente rinviate)

- Fatturazione elettronica.
- Integrazioni con strumenti di pagamento reali.
- App mobile nativa.
- Reportistica avanzata / analytics.
- Gestione multi-sede avanzata (oltre alla struttura multi-azienda di base).
