#!/bin/bash
cd -- "$(dirname "$BASH_SOURCE")"
echo 'Download folder from SocialDesicionLab Server'
echo '============================================='
echo 'Please specify folder to download:'
read folder
mkdir $folder
scp -r oescha@socialdecisionlab.timgroup.ethz.ch:/home/oescha/socialdecisionlab/data/csv/$folder/. $folder/.
