def get_page(args: dict):
    limit = int(args.get('limit', 5))
    offset = int(args.get('offset', 0))
    return limit, offset
