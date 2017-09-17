#!/usr/bin/env bash

killall java
cd /Users/baihuibo/soft/zookeeper-3.4.8/bin
sh ./zkServer.sh stop
sh ./zkServer.sh start