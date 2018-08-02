FROM mhart/alpine-node

#apps dir
WORKDIR /usr/src/app

#copy our package files to docker container
COPY package*.json ./

RUN npm install

# bundle app source
COPY . .

# our apps port
EXPOSE 1337

CMD ["npm","run","start-game"]