FROM node:4.2.6

ENV projectName PROJECT
ENV gitUser somaholiday
ENV gitRepo barlights

RUN apt-get update

RUN mkdir ${projectName}
WORKDIR ${projectName}

RUN git clone https://github.com/${gitUser}/${gitRepo}.git 
WORKDIR ${gitRepo}

RUN npm install

CMD bash -c "node main.js"
