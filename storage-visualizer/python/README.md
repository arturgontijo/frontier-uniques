# Python Substrate Interface Storage Visualizer

```shell
pip3 install -r requirements.txt
python3 substorage --help
```

```
usage: substorage [-h] [--url URL] [--module MODULE] [--entry ENTRY] [--params PARAMS [PARAMS ...]] [--metadata]

Dump Substrate Storage

optional arguments:
  -h, --help            show this help message and exit
  --url URL             Node websocket url. (default: ws://127.0.0.1:9944)
  --module MODULE       Storage module. (default: EVM)
  --entry ENTRY         Storage module entry. (default: AccountStorages)
  --params PARAMS [PARAMS ...]
                        Storage module entry params. (default: ['0xc2bf5f29a4384b1ab0c063e1c666f02121b6084a'])
  --metadata            Dump Storage metadata. (default: False)

```

```shell
# To inspect data of a contract at 0xc2bf5f29a4384b1ab0c063e1c666f02121b6084a
python3 substorage --params 0xc2bf5f29a4384b1ab0c063e1c666f02121b6084a

# or for 0xfe5d3c52f7ee9aa32a69b96bfbb088ba0bcd8efc
python3 substorage --params 0xfe5d3c52f7ee9aa32a69b96bfbb088ba0bcd8efc

# or for Uniques Module, inspect all items that 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
# owns from collection 0xc2bf5f29a4384b1ab0c063e1c666f02121b6084a
python3 substorage --module Uniques --entry Account --params 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY 0xc2bf5f29a4384b1ab0c063e1c666f02121b6084a

# or check the 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY account
python3 substorage --module System --entry Account --params 5CLVXv2QY26xSG1ih7YkaRkSS3n6nS5kfJLdzykAgTuTtdVc

# or check the node metadata
python3 substorage --metadata
```
