import argparse
import json

from substrateinterface import SubstrateInterface
from substrateinterface.exceptions import StorageFunctionNotFound


def query_map_and_print(
    url='ws://127.0.0.1:9944',
    module='EVM',
    entry='AccountStorages',
    params=None
):
    substrate = None
    try:
        substrate = SubstrateInterface(url=url)

        result = substrate.query_map(
            module,
            entry,
            params=params,
            page_size=200,
            max_results=400
        )

        for r in sorted(result, key=lambda x: x[0]):
            print(f'{r[0]} -> {r[1]}')

    except StorageFunctionNotFound as e:
        print(f'\nERROR: {e}')
        print(f'\nERROR: Try "substorage --metadata"\n')

    except Exception as e:
        if substrate:
            try:
                result = substrate.query(module, entry, params=params)
                print(result)
                return
            except Exception as _e:
                e = _e
        print(f'\nERROR: {e}')
        print(f'\nERROR: Maybe try it with "--params None"')
        print(f'\nERROR: Is you Substrate node up and running at "{url}"?\n')


def main():
    parser = argparse.ArgumentParser(description='Dump Substrate Storage', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--url', help='Node websocket url.', default='ws://127.0.0.1:9944')
    parser.add_argument('--module', help='Storage module.', default='EVM')
    parser.add_argument('--entry', help='Storage module entry.', default='AccountStorages')
    parser.add_argument(
        '--params',
        help='Storage module entry params (try "None" for no params).',
        nargs='+',
        default=['0xc2bf5f29a4384b1ab0c063e1c666f02121b6084a']
    )
    parser.add_argument('--metadata', help='Dump Storage metadata.', action='store_true')
    args = parser.parse_args()

    if args.metadata:
        substrate = SubstrateInterface(url=args.url)
        sub_modules = {}
        for item in substrate.get_metadata_storage_functions():
            mod_id = item['module_id']
            if mod_id in sub_modules:
                sub_modules[mod_id].append(item['storage_name'])
            else:
                sub_modules[mod_id] = [item['storage_name']]
        for k, v in sub_modules.items():
            sub_modules[k] = sorted(v)
        print(json.dumps(sub_modules, indent=2))
    else:
        query_map_and_print(
            url=args.url,
            module=args.module,
            entry=args.entry,
            params=args.params if args.params[0] != 'None' else None,
        )


if __name__ == '__main__':
    main()
