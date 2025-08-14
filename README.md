# crimecrawler
scraping criminal data
This repository contains two related websites:

1. CRIMINALRECORD — A website containing data about criminals.  
2. CRIMECRAWLER — A separate project with frontend and backend that scrapes criminal data from the CriminalRecords website and displays it to users.


# How to run
cd kafka-docker-setup
docker-compose up -d



cd backend 
npm i
npm run dev


cd frontend/crimecrawler
npm i
npm run dev


cd CRIMERECORD
cd backend
npm i
npm run dev
cd frontend
npm i
npm run dev

//to run prisma migrations if you are using your own database
npx prisma migrate dev --name init// npx prisma migrate
