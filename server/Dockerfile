FROM ubuntu:xenial

ENV WORKINGDIR=/root/app

WORKDIR ${WORKINGDIR}

RUN	mkdir -p ${WORKINGDIR} && chmod 666 ${WORKINGDIR}

COPY ./app  ${WORKINGDIR}/

RUN	apt-get -y update		&&	\
	apt-get -y install apt-utils	&&	\
	apt-get -y install nodejs	&&	\
	apt-get -y install npm		&&	\
						\
	apt-get -y install iptables	&&	\
	apt-get -y install net-tools	&&	\
	apt-get -y install netcat	&&	\
	apt-get -y install iputils-ping	&&	\
	apt-get -y install iproute2	&&	\
	apt-get -y install curl		&&	\
	apt-get -y clean

RUN	npm install

EXPOSE 3000

CMD nodejs index.js

