Opdracht: Problematiek

Combat Sport Club Aranha in Zwevegem (worstelen, grappling, Brazilian jiu-jitsu en MMA) heeft geen applicatie om huidige leden in te schrijven. Er wordt gebruikgemaakt van Excel om leden in te schrijven. De club wordt bestuurd door de broers Oziev, die de coaches en eigenaars van de club zijn.

Ik heb besloten om een back-end applicatie te ontwikkelen en deze eventueel in de toekomst te combineren met een front-end. De functionaliteiten zijn als volgt:

Functionaliteit:

Admin:
 - Kan registreren
 - Kan zijn gegevens veranderen
 - Kan de lijst van alle admins opvragen
 - Kan andere admins verwijderen
 - Kan leden toevoegen en beheren:
    - Alle leden opvragen
    - Een lid toevoegen
    - Gegevens van een lid veranderen
    - Een lid verwijderen
    - Leden opvragen die betaald of niet betaald hebben
    - Een lid als betaald markeren
    - Leden sorteren op type lidmaatschap
    - Het type lidmaatschap van een lid veranderen


Database:
 - https://cloud.mongodb.com/
 - mongodb+srv://justas-vives:justas@nodejs-exam.dcc2ju8.mongodb.net/
 - username: justas-vives
 - wachtwoord: justas
 - database name: AranhaBelgium
 - network access: all ip ranges (voor u omn dit te kunnen testen)


Deployment:
 - link naar api: https://nodejs-exam-justas.onrender.com/
 - Project is gedeployed op https://render.com/

    Stappen plaan:
        - Er werd git repository gecloned zodat dit op mijn github account staat
        - Access geven voor render aan de repository en access bevestiging met github account
        - Installatie van render op dit repository
        - Web service naam kiezen - nodejs-exam-justas
        - Region kiezen (Frankfurt, EU Central)
        - git branch: main
        - Runtime: Node
        - Build command - npm install
        - Start command - node index.js
        - Environment Variables: vivest_jwtPrivateKey 'justas'
        - drukken op 'Create Web Service'
        - Server werd succesvol gedeployed en webservice is toegankelijk via de webrowser
        - Bij opvragen van api https://nodejs-exam-justas.onrender.com/api/members  - app CRASH
        - Deployment shell openen via web-browser en commando 'npm i express' uitvoeren
        - Web service herstarten
        - Api is bereikbaar

Voor applicatie te testen, gelieve eerste auth token ophalen van:
    1. api_calls -> api_calls_auth.http -> ### 18. Auth POST call
    2. Plaats auth-token bij iedere .http file op tweede lijn @authToken = ...

 

