FROM resin/rpi-raspbian

ENV gitUser somaholiday
ENV gitRepo barlights

RUN apt-get update
RUN apt-get install git

RUN git clone https://github.com/${gitUser}/${gitRepo}.git 

RUN git clone https://github.com/scanlime/fadecandy.git

CMD bash -c "fadecandy/bin/fcserver-rpi ${gitRepo}/fcserver-config"
