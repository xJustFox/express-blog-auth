# Esercizio: express-blog-auth

Creiamo le seguenti rotte:
- `GET /home` 
- `GET /posts` (index)
- `POST /posts` (store)
- `GET /posts/:slug` (show)

Tramite JWT creiamo una rotta per autenticare un utente ed ottenere il Token JWT e tramite un middleware limitiamo l'accesso alla rotta `store` dei post ai soli utenti loggati.

Gestiamo, attraverso dei middleware, gli errori e le pagine 404.  
Questi middleware dovranno rispondere con un JSON contenente il codice ed il messaggio dell'errore.

Svolgiamo tutto l'esercizio tramite relativi controller e router.

## Bonus

- Ritornare un errore diverso nel caso il JWT sia non valido o scaduto.
- Creare un middleware per proteggere le rotte riservate agli utenti admin.
