def read_in_chunks(filename, chunk_size=10, encoding='utf-8'):
    with open(filename, 'r', encoding=encoding) as f:
        for chunk in iter(lambda: f.readlines(chunk_size), []):
            yield chunk