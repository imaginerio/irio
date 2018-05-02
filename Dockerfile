FROM ubuntu:16.04

RUN apt-get update -q && apt-get install -y \
    wget \
    git \
    software-properties-common

# you might have to update your outdated clang
RUN add-apt-repository -y ppa:ubuntu-toolchain-r/test
RUN apt-get update -y
RUN apt-get install -y gcc-6 g++-6 clang-3.8
RUN export CXX="clang++-3.8" && export CC="clang-3.8"

# install mapnik
RUN git clone https://github.com/mapnik/mapnik mapnik-3.x --depth 10
RUN apt-get clean
RUN apt-get install -y python zlib1g-dev clang make pkg-config curl

RUN cd mapnik-3.x \
    && git submodule update --init \
    && /bin/bash bootstrap.sh
RUN cd mapnik-3.x \
    && ./configure \
    && make \
    && make install