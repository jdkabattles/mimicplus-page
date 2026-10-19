#!/usr/bin/env python3
import sys

def parse_set(s):
    return set(int(x.strip()) for x in s.split(',') if x.strip().isdigit())

def check_line(line):
    parts = [p.strip() for p in line.split('|')]
    if len(parts) < 3:
        return False, "bad format"
    endpoint = parts[0]
    fixture_part = parts[1]
    client_part = parts[2]
    if not fixture_part.lower().startswith('fixture:') or not client_part.lower().startswith('client:'):
        return False, "missing fixture: or client:"
    fixture = parse_set(fixture_part.split(':', 1)[1])
    client = parse_set(client_part.split(':', 1)[1])
    widened = client - fixture
    if widened:
        return False, f"{endpoint}: widened {sorted(widened)} (client {sorted(client)} - fixture {sorted(fixture)})"
    return True, f"{endpoint}: ok"

def main():
    if len(sys.argv) < 2:
        print("usage: check_success_class.py <file>", file=sys.stderr)
        sys.exit(2)
    failed = False
    with open(sys.argv[1]) as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith('#'):
                continue
            ok, msg = check_line(line)
            print(msg)
            if not ok:
                failed = True
    sys.exit(1 if failed else 0)

if __name__ == '__main__':
    main()
