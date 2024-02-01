# Base img
FROM node:18-alpine

# app directory
WORKDIR /Tiler

# copy code
COPY . /Tiler

# app dependency (node modules)
RUN npm install --f

# build project
RUN npm run build

# app port
EXPOSE 3000

# app start
CMD npm run start:prod