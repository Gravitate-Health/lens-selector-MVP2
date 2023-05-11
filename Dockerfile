FROM node:16-slim as buildstage

WORKDIR /usr/src/app

COPY --chown=node package*.json ./
RUN npm install
COPY --chown=node . .
RUN npm run build

ENV PORT=3000 
USER node


EXPOSE ${PORT}

CMD ["node", "build/index.js" ]

