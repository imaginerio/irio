FROM ubuntu:16.04

RUN apt-get update -q && apt-get install -y \
    wget \
    git \
    software-properties-common \
    python-software-properties

RUN add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main" \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

RUN apt-get update -q && apt-get install -y postgresql-9.6 postgresql-contrib-9.6

RUN add-apt-repository ppa:ubuntugis/ubuntugis-unstable

RUN apt-get update -q && apt-get install -y postgis postgresql-9.6-postgis-2.3

RUN add-apt-repository -y ppa:ubuntu-toolchain-r/test

RUN apt-get update -y \
    && apt-get install -y gcc-6 g++-6 clang-3.8 python zlib1g-dev clang make pkg-config curl \
    && export CXX="clang++-3.8" && export CC="clang-3.8"

RUN git clone https://github.com/mapnik/mapnik mapnik-3.x --depth 10

RUN cd mapnik-3.x \
    && git submodule update --init \
    && /bin/bash bootstrap.sh \
    && ./configure CUSTOM_CXXFLAGS="-D_GLIBCXX_USE_CXX11_ABI=0" CXX=${CXX} CC=${CC} \
    && make \
    && make test \
    && make install