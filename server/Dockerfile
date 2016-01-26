FROM resin/rpi-raspbian

ENV gitUser somaholiday
ENV gitRepo barlights

RUN apt-get update
RUN apt-get install -y \
    git \
    usbutils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


RUN git clone git://github.com/${gitUser}/${gitRepo}.git \
    && git clone git://github.com/scanlime/fadecandy.git

CMD bash -c "fadecandy/bin/fcserver-rpi barlights/server/fcserver-config"
