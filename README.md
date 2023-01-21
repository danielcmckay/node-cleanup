# node-cleanup

This is a basic Desktop file cleaner for a MacOS system. The script will:
* Move any default "Screen shot" images to a `Screenshots` directory
* Move images, videos, and documents to their respective folders

A simple bash script, `do-cleanup.sh` is added to be used as a cron job, such as:

```
crontab -e

0 0 * * * /PATH/TO/SCRIPT

```