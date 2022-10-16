from substrateinterface import SubstrateInterface


substrate = SubstrateInterface(
    url="ws://127.0.0.1:9944",
    ss58_format=42,
)

# substrate.get_metadata_storage_functions()

def query_map_and_print(
    module='EVM',
    entry='AccountStorages',
    params=None
):
    result = substrate.query_map(
        module,
        entry,
        params=params or [],
        page_size=200,
        max_results=400
    )

    for r in result:
	    print(f'{r[0]} -> {r[1]}')

query_map_and_print(
    module='EVM',
    entry='AccountStorages',
    params=[
        '0xC2Bf5F29a4384b1aB0C063e1c666f02121B6084a'            # Contract
    ],
)

query_map_and_print(
    module='Uniques',
    entry='Account',
    params=[
        '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',     # Owner
        '0x0000000000000000000000000000000000000000'            # CollectioniId (H160)
    ],
)
