FROM hypriot/rpi-node:4.2.4

ENV projectName barlights

RUN apt-get update

RUN mkdir ${projectName}
COPY . ${projectName}
WORKDIR ${projectName}/app

RUN git clone git://github.com/scanlime/fadecandy.git

RUN npm install

CMD bash -c "node ../main.js"
