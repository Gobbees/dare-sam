FROM node

WORKDIR /crystal-ball

COPY ./package.json ./
COPY ./packages/service/package.json ./packages/service/
COPY ./packages/database/package.json ./packages/database/
COPY ./packages/common/package.json ./packages/common/

RUN yarn install --production

COPY ./packages/service/dist ./packages/service/dist
COPY ./packages/database/dist ./packages/database/dist
COPY ./packages/common/dist ./packages/common/dist
COPY ./packages/service/.env.production ./packages/service/.env

WORKDIR /crystal-ball/packages/service

# CMD ["cat", ".env.production"]
CMD ["node", "dist/service/src/index.js"]