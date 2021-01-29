#!/bin/bash

#
# StreamTeam
# Copyright (C) 2019  University of Basel
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#

# Script which deploys the Real-Time Football Web Client without the video

IP="10.34.58.65"
USER="ubuntu"
KEY="$HOME/.ssh/DemoMAAS"
FOLDER="/var/www/html/real-time-football-web-client"
ARCHIVENAME="real-time-football-web-client-web.tar"

#http://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

echo "Remove $ARCHIVENAME locally"
rm $ARCHIVENAME

cd ../web

echo "Create $ARCHIVENAME"
# https://superuser.com/questions/540044/is-it-possible-to-provide-a-blacklist-of-filenames-to-tar-to-prevent-those-files
tar -cf ../$ARCHIVENAME ./ --exclude=./vid/*

cd ..

echo "Remove $ARCHIVENAME from $IP"
ssh -i $KEY $USER@$IP "rm $ARCHIVENAME"

echo "Delete all but video from $IP"
# https://superuser.com/questions/607264/exclude-subfolders-with-specific-files-in-recursive-rm-rf-folder
ssh -i $KEY $USER@$IP "find $FOLDER ! -regex $FOLDER/vid/* -delete"

echo "Copy $ARCHIVENAME to $IP"
scp -i $KEY ./$ARCHIVENAME $USER@$IP:$ARCHIVENAME

echo "Extract $ARCHIVENAME at $IP"
ssh -i $KEY $USER@$IP "mkdir $FOLDER"
ssh -i $KEY $USER@$IP "tar -xf $ARCHIVENAME -C $FOLDER"

echo "Remove $ARCHIVENAME from $IP"
ssh -i $KEY $USER@$IP "rm $ARCHIVENAME"

echo "Remove $ARCHIVENAME locally"
rm $ARCHIVENAME