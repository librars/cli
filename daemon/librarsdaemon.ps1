###
### Andrea Tino - 2020
###

param(
    [int]$port, 
    [string]$dir
)

node index.js --port $port --dir $dir
