FROM hypriot/rpi-node:4.2.4

ENV projectName PROJECT
ENV gitUser somaholiday
ENV gitRepo barlights

RUN apt-get update

RUN mkdir ${projectName}
WORKDIR ${projectName}

RUN git clone https://github.com/${gitUser}/${gitRepo}.git 
WORKDIR ${gitRepo}/app

RUN npm install

CMD bash -c "node main.js"
